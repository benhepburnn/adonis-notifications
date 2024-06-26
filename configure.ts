/*
|--------------------------------------------------------------------------
| Configure hook
|--------------------------------------------------------------------------
|
| The configure hook is called when someone runs "node ace configure <package>"
| command. You are free to perform any operations inside this function to
| configure the package.
|
| To make things easier, you have access to the underlying "ConfigureCommand"
| instance and you can use codemods to modify the source files.
|
*/

import ConfigureCommand from '@adonisjs/core/commands/configure'
import { stubsRoot } from './stubs/main.js'

export async function configure(_command: ConfigureCommand) {
  const codemods = await _command.createCodemods()

  // Create config file
  await codemods.makeUsingStub(stubsRoot, 'config/notifications.stub', {})

  // Add service to rc file
  try {
    await codemods.updateRcFile((rcFile) => {
      rcFile.addProvider('@benhepburn/adonis-notifications/notifications_provider')
    })
  } catch (error) {
    console.error('Unable to update adonisrc.ts file')
    console.error(error)
  }
}
