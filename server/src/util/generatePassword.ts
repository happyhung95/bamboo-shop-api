export default (extraString: string): string => {
  // Generate a random number.
  const number = Math.random()

  // Convert this number into a string and add extraString
  const string = number.toString(36) + extraString

  const length = Math.random()

  // Grab a section of the string as the password
  const password = string.slice(length)

  // Return the password back!
  return password
}
