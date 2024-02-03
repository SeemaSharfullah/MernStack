const Listing =require("../models/listingModel.js") ;
const { errorHandler } =require("../middleware/error.js") ;

const User =require('../models/userModel.js')
const createListing = async (req, res) => {
 

  
  try {
    // Destructure relevant properties from the request body
    const {
      name,
      description,
      address,
      regularPrice,
      discountPrice,
      bathrooms,
      bedrooms,
      furnished,
      parking,
      type,
      offer,
      
    } = req.body;
   
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded." });
    }
    
   
    const images = req.files.map(file => file.filename);
   
    const listing = await Listing.create({
      name,
      description,
      address,
      regularPrice,
      discountPrice,
      bathrooms,
      bedrooms,
      furnished,
      parking,
      type,
      offer,
      images,
     
    });
    console.log("Listing is created successfully");
  
    return res.status(201).json(listing);
   
  } catch (error) {
    
    next(error);
  }
};






 const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }

  // if (req.user.id !== listing.userRef) {
  //   return next(errorHandler(401, "You can only delete your own listing!"));
  // }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted!");
  } catch (error) {
    next(error);
  }
};

const updateListing = async (req, res) => {
  console.log(req.body)

  try {
    const { name, description, address, regularPrice, discountPrice, bathrooms, bedrooms, furnished, parking, type, offer } = req.body;
    const images= req.files.map((file)=>file.filename)

    const newdata = {};


    if (name) newdata.name = name;
    if (images) newdata.images = images;
    if (description) newdata.description = description;
    if (address) newdata.address = address;
    if (regularPrice) newdata.regularPrice = regularPrice;
    if (discountPrice) newdata.discountPrice = discountPrice;
    if (bathrooms) newdata.bathrooms = bathrooms;
    if (bedrooms) newdata.bedrooms = bedrooms;
    if (furnished) newdata.furnished = furnished;
    if (parking) newdata.parking = parking;
    if (type) newdata.type = type;
    if (offer) newdata.offer = offer;

    // if (images) {
    //   // Assuming images is an array of strings
    //   newdata.images = images;
    // }

    let data = await Listing.findById(req.params.id);

    if (!data) {
      console.log("Data is not found with this ID");
      return res.status(404).send("Data does not exist with this ID");
    } else {
      data = await Listing.findByIdAndUpdate(req.params.id, { $set: newdata }, { new: true });

      if (!data) {
        return res.status(404).json({ error: 'Listing not found!' });
      }

      res.json(data);
    }
  } catch (error) {
    console.error("Some error occurred", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};






    




 const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.find();
    // if (!listing) {
    //   return next(errorHandler(404, "Listing not found!"));
    // }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};






const getSingleList = async(req, res)=>{
  try{
      let dataa = await Listing.findById(req.params.id);
      console.log(dataa)
      res.json(dataa)
  }
  catch(error){
          console.error("some erroroccured"+error);
          res.status(500).json("Some internal error!!!")
      }
}







const Token= async (req, res) => {
  // The request has a valid token, and decoded data is available in req.user
  res.json({ message: 'Protected route accessed', user: req.user });
}



const Search = async (req, res) => {
  const { address, type, furnished,parking, offer } = req.query;
  console.log('Received parameters:', { address, type, furnished, offer });
  try {
    // Build the search query based on the provided parameters
    const searchQuery = {};
    if (address) {
      searchQuery.address = new RegExp(address, 'i');
    }
    if (type && type !== 'all') {
      searchQuery.type = type;
    }
    if (furnished && furnished !== 'all') {
      // Convert string to boolean
      searchQuery.furnished = furnished.toLowerCase() === 'yes';
    }
    if (parking && parking !== 'all') {
      // Convert string to boolean
      searchQuery.parking = parking.toLowerCase() === 'yes';
    }
    if (offer && offer !== 'all') {
      // Convert string to boolean
      searchQuery.offer = offer.toLowerCase() === 'yes';
    }

    // Perform the search using the constructed query
    const result = await Listing.find(searchQuery);

    // Send the search result as a JSON response
    res.json(result);
  } catch (error) {
    console.error('Error searching properties:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




module.exports={createListing,deleteListing,getListing,getSingleList,updateListing,Token,Search}