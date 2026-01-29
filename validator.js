import validator from 'validator'

function validation(data){

  const reqField = ['emailid','password','firstName', 'age']
    // const isAllowed = reqField.every((k)=>Object.keys(data.body).includes(k))
    const isAllowed = reqField.every(k=> k in data)

    if(!isAllowed)
      throw new Error('required fields are missing')

    if(!validator.isEmail(data.emailid))
      throw new Error('enter a valid email address')

    if(!validator.isStrongPassword(data.password))
      throw new Error("please enter a strong password")

    if(!(data.firstName.length>=3 && data.firstName.length<=20))
      throw new Error("First Name should be atleast 3 letters and atmost 20 ")

    if(!(Number(data.age)>=14 && Number(data.age)<=80))
      throw new Error("minimum age should be 14 and maximum age should be 80")

    const AllGender = ['male','female','other','others']

    if(!(AllGender.includes(data.gender.toLowerCase())))
      throw new Error("Please enter a valid gender")
}

export {validation};