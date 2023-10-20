import { User } from './user'

export type Tokens = {
  accessToken: string
  refreshToken: string
}

export type LoginFields = {
  login: string
  password: string
}

export type ChangePasswordFormFields = {
  oldPassword: string
  newPassword: string
}

export type LoginResponse = {
  tokens: Tokens
  user: User
}

export type ChangePasswordResponse = {
  tokens: Tokens
}
