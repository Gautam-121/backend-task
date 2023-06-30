const Customer = require("../model/customerModel.js")
const ErrorHandler = require("../utils/errorHandler.js")
const {phoneNumberRegex , emailRegex} = require("../utils/helper.js")

const setEmail = new Set()
const setPhone = new Set()
const setLinkedId = new Set()

// Create a new Contact document and return it with empty secondaryContactIds array
async function createNewContact(email, phoneNumber) {

    const newContact = await Customer.create({
      email,
      phoneNumber,
      linkPrecedence: 'primary',
      linkedId : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  
    return {
      contact: {
        primaryContactId: newContact._id,
        emails : newContact.email ? [newContact.email] : [],
        linkedId : newContact.linkedId,
        phoneNumbers : newContact.phoneNumber ? [newContact.phoneNumber] : [],
        secondaryContactIds: [],
      },
    };
  }

async function getUpdateCustomer(emailExist , phoneExist , contactUserData){

    const updateCustomer = await Customer.findByIdAndUpdate(
      {
        _id : (Date.now(phoneExist.phoneCreatedAt) < Date.now(emailExist.emailCreatedAt)) ? emailExist._id : phoneExist._id
      },
      {
        $set : {
          linkPrecedence : "secondary",
          linkedId : (Date.now(phoneExist.phoneCreatedAt) > Date.now(emailExist.emailCreatedAt)) ? phoneExist._id : emailExist._id ,
          updatedAt : new Date()
        }
      },
      {new : true}
    )

    contactUserData.forEach(res => {
      if(res.email) setEmail.add(res.email)
      if(res.phoneNumber) setPhone.add(res.phoneNumber)
      if(res.linkedId)  setLinkedId.add(res.linkedId)
   } )

    return {
      contact : {
        primaryContactId: emailExist._id,
        emails : [...setEmail.values()],
        phoneNumbers : [...setPhone.values()],
        secondaryContactIds: [updateCustomer.linkedId , ...setLinkedId.values()]
      }
    }
  }

async function getSecondary(user , email , phoneNumber){

  for(let i = 0 ; i<user.length ; i++){

     //Email is Commmon Phone differ created New Contact secondary Using PhoneDiffer
     if(user[i].email && user[i].email === email){

      const customer = await Customer.create({

        email,
        phoneNumber : phoneNumber,
        linkedId : user[i].linkPrecedence === "primary" ? user[i]._id : user[i].linkedId,
        linkPrecedence : "secondary",
        createdAt : new Date(),
        updatedAt : new Date()

      })

      user.forEach(res => {
        if(res.email) setEmail.add(res.email)
        if(res.phoneNumber) setPhone.add(res.phoneNumber)
        if(res.linkedId) setLinkedId.add(res.linkedId)
      })

      return {

        primaryContactId : customer.linkedId,
        emails : [...setEmail.values()],
        phoneNumber : [phoneNumber, ...setPhone.values()],
        secondaryContactIds : [customer._id , ...setLinkedId.values()]
      }
    }

    // Phoe is Commmon , Email differ created New Contact Secondary Using email Differ
    if(user[i].phoneNumber && user[i].phoneNumber === phoneNumber){

      const customer = await Customer.create({

        email : email,
        phoneNumber,
        linkedId : user[i].linkPrecedence === "primary" ? user[i]._id : user[i].linkedId,
        linkPrecedence : "secondary",
        createdAt : new Date(),
        updatedAt : new Date()

      })

      contactUserData.forEach(res => {

        if(res.email) setEmail.add(res.email)
        if(res.phoneNumber) setPhone.add(res.phoneNumber)
        if(res.linkedId) setLinkedId.add(res.linkedId)

      })

      return {

        primaryContactId : customer.linkedId,
        emails : [email , ...setEmail.values()],
        phoneNumber : [...setPhone.values()],
        secondaryContactIds : [customer._id , ...setLinkedId.values()]
      }
    }

  }
}
  

const customerRegister = async(req , res , next)=>{

    try{

        const {email , phoneNumber} = req.body

        if(!email && !phoneNumber){
            return next(new ErrorHandler("Please send at least one data" , 400))
        }

        if(phoneNumber && !phoneNumberRegex.test(phoneNumber)){
          return next(new ErrorHandler("ph-Number is Invalid"))
        }

        if(email && !emailRegex.test(email)){
          return next(new ErrorHandler("Email is Invalid"))
        }

        const contactUserData = await Customer.find({
            $or: [
              { email : email ? email : "" },
              { phoneNumber : phoneNumber ? phoneNumber : "" },
            ],
          })


        //new Customer Created Primary Contact
        if(contactUserData.length === 0){
            const contactCreate = await createNewContact(email , phoneNumber)
            return res.status(200).json(contactCreate)
        }

        const isAlready = await Customer.findOne({email : email , phoneNumber : phoneNumber})

        if(isAlready){
          return next(new ErrorHandler("This User already exist" , 400))
        }

        const emailExist = {}
        const phoneExist = {}

      //Email and Phone-Number both exist Update the customer
        contactUserData.forEach(val => {

          if(email && val.email === email && val.linkPrecedence === "primary"){

            emailExist.isPresent = true
            emailExist._id  = val._id,
            emailCreatedAt = val.createdAt

          }

          if(phoneNumber && val.phoneNumber === phoneNumber && val.linkPrecedence === "primary"){

            phoneExist.isPresent = true
            phoneExist._id = val._id,
            phoneExist.phoneCreatedAt = val.createdAt

          }
        })

        if((emailExist.isPresent && phoneExist.isPresent)){

          const updateCustomer = await getUpdateCustomer(emailExist , phoneExist , contactUserData)

          return res.status(200).json(updateCustomer)
        }

        const addSecondaryCustomer = await getSecondary(contactUserData , email , phoneNumber)

        return res.status(200).json({
          contact : addSecondaryCustomer
        })

    }catch(err){
        return next(new ErrorHandler(err , 500))
    }
}

module.exports = {customerRegister}