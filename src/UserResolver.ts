import { Resolver, Query, Arg, Mutation, ObjectType, Field } from "type-graphql";
import { hash, compare } from "bcryptjs";
import {sign} from 'jsonwebtoken'
import { User } from "./entity/User";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return 'hi!'
  }

  @Query(() => [User])
  users() {
    return User.find()
  }

  @Mutation(() => Boolean)
  async register(
    @Arg('email') email: string,
    @Arg('password') password: string,
  ) {
    const hashedPassword = await hash(password, 12)

    try {
      await User.insert({
        email,
        password: hashedPassword
      })
    } catch (err) {
      console.log('err: ', err);
      return false
    }
    return true
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
  ): Promise<LoginResponse> {
    const user = await User.findOne({where: { email }})
    if (!user) {
      throw new Error('user can not be found')
    }
    const valid = await compare(password, user.password)
    if (!valid) {
      throw new Error('password is not correct')
    }
    return {
      accessToken: sign({userId: user.id}, 'randomSecret', {expiresIn: '15m'})
    }
  }
}