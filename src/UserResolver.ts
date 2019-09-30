import { Resolver, Query, Arg } from "type-graphql";
import { hash } from "bcryptjs";
import { User } from "./entity/User";

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return 'hi!'
  }
  @Mutation()
  async register(
    @Arg('email') email: string,
    @Arg('password') password: string,
  ) {
    const hashedPassword = await hash(password, 12)
    await User.insert({
      email,
      password: hashedPassword
    })
    return
  }
}