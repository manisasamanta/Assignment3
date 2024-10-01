const userModel = require("../Models/UserModel");
const fs=require('fs')
const path = require('path')

class userController{



    updateProfile = async(req,res)=>{
        const id = req.params.id;
        const newImage = req.file.path;
      
        try {
            //Remove the previous image file if a new image was uploaded
            const df=await userModel.findById(id)
            fs.unlinkSync(df.image)
          const updatedUser = await userModel.findByIdAndUpdate(
            id,
            {
                name: req.body.name,
               
                image: newImage,
            },  
            { new: true }
          );
          
         return res.status(200).send({
            status:true,
            message:'update successful',
            data:updatedUser
         })   
        } catch (err) {
          return res.status(500).send(err.message);
          
        
        }
    }

    

//     const id = req.params.id;
//     let newImage;

//     try {
//         // Check if a new image was uploaded
//         if (req.file) {
//             newImage = req.file.path;
//         }

//         const df = await userModel.findById(id);

//         // Log the current and new image paths
//         console.log("Current image:", df.image);
//         console.log("New image:", newImage);

//         // Remove the previous image file if a new image was uploaded
//         if (newImage && df.image) {
//             try {
//                 fs.unlinkSync(df.image);
//             } catch (unlinkErr) {
//                 console.error("Error deleting old image:", unlinkErr);
//                 // If you want to handle this error specifically, you can do so here
//                 // But do not send a response if you have already sent one.
//             }
//         }

//         const updatedUser = await userModel.findByIdAndUpdate(
//             id,
//             {
//                 name: req.body.name,
//                 image: newImage || df.image, // Keep the old image if no new image was uploaded
//             },
//             { new: true }
//         );

//         // Send a success response and ensure no further execution
//         return res.status(200).json({
//             status: true,
//             message: 'Update successful',
//         });

//     } catch (err) {
//         // Ensure the error response is only sent once
//         if (!res.headersSent) {
//             return res.status(500).json({ error: err.message });
//         } else {
//             console.error("Error after headers were sent:", err);
//         }
//     }
// };


showUser = async (req, res) => {
    try {
        const id = req.user._id;
        const data = await userModel.findById(id);

        // Send the response and stop further execution
        return res.status(200).json({
            status: true,
            message: 'Profile data fetched',
            data: data
        });

    } catch (err) {
        console.error(err.message);

        // Prevent double response
      
            return res.status(500).json({ error: 'An error occurred while fetching the profile data' });
        
    }
};



  
}


module.exports=new userController()