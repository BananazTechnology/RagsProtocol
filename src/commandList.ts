import { Profile } from './commands/profile/profile'
import { Help } from './commands/help/help'
import { Command } from './interfaces/command'
import { Hack } from './commands/hack/hack'
import { Leaderboard } from './commands/leaderboard/leaderboard'
import { Category } from './commands/category/category'

export const Commands: Command[] = [new Help(), new Profile(), new Hack(), new Leaderboard(), new Category()]
