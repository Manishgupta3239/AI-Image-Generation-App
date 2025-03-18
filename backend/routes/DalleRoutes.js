// import dotenv from 'dotenv';
// import express from 'express';
// const { OpenAI } = await import('openai');
// dotenv.config();

// const openai = new OpenAI({
//   apiKey: process.env.OPEN_AI_API_KEY,
// });

// const router = express.Router();

// router.post('/create', async (req, res) => {
//   try {
//     const { prompt } = req.body;

//     // Assuming `openai.images.create` works in this way
//     const response = await openai.images.generate({
//       model: "dall-e-3",
//       prompt: "a white siamese cat",
//       n: 1,
//       size: "1024x1024",
//     });
//     // image_url = response.data[0].url;

//     const image = response.data[0].url; // Update depending on SDK's structure
//     res.status(200).json({ photo: image });

//   } catch (error) {
//     console.log("Error while generating image", error.message);
//     res.status(500).json({ error: "Failed to generate image" });
//   }
// });

// export default router;
import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';

dotenv.config();

const router = express.Router();
router.post('/create', async (req, res) => {
  try {
    const { prompt } = req.body;

    const hfModelEndpoint = "https://api-inference.huggingface.co/models/dreamlike-art/dreamlike-photoreal-2.0";


    const payload = {
      inputs: prompt || "a white siamese cat",
      options: {
        guidance_scale: 7.5,
        num_inference_steps: 50,
      },
    };

    let response;
    let retries = 3; // Number of retries allowed

    while (retries > 0) {
      response = await axios.post(hfModelEndpoint, payload, {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        },
        responseType: 'arraybuffer', // Handle binary image data
        validateStatus: false, // Don't throw on non-2xx status codes
      });
    
      if (response.status === 503) {
        try {
          const errorData = JSON.parse(Buffer.from(response.data).toString('utf8'));
          if (errorData.error && errorData.error.includes("loading")) {
            const estimatedTime = errorData.estimated_time * 1000 || 30000; // Default wait 30 seconds
            console.log(`Model is loading. Retrying in ${estimatedTime / 1000} seconds...`);
            await new Promise((resolve) => setTimeout(resolve, estimatedTime));
            retries -= 1;
            continue; // Retry the loop
          }
        } catch (parseError) {
          console.log("Failed to parse loading error:", parseError.message);
        }
      }
    
      break; // Exit the loop if the response is successful or no retry condition is met
    }
    
    if (response.status !== 200) {
      const errorDetails = Buffer.from(response.data).toString('utf8'); // Convert error to readable text
      console.error("Image generation error:", errorDetails);
      throw new Error(`Failed to generate image. HTTP ${response.status}: ${errorDetails}`);
    }
    
    // Successfully parse the binary response as an image
    const base64Image = Buffer.from(response.data).toString('base64');
    const mimeType = 'image/png';
    
    res.status(200).json({
      photo: `data:${mimeType};base64,${base64Image}`,
    });
      } catch (error) {
    console.error("Error while generating image:", error.message);

    // Extract error details for client response
    const errorDetails = error.response?.data
      ? Buffer.from(error.response.data).toString()
      : error.message;

    res.status(500).json({
      error: "Failed to generate image",
      details: errorDetails,
    });
  }
});

export default router;