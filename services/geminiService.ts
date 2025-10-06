import { GoogleGenAI, GenerateContentResponse, Modality, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const fetchGeneratedFile = async (uri: string): Promise<Blob> => {
    const response = await fetch(`${uri}&key=${API_KEY}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch generated file: ${response.statusText}`);
    }
    return response.blob();
};

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};

export const generatePromptFromImage = async (imageFile: File): Promise<string> => {
    const imagePart = await fileToGenerativePart(imageFile);
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                imagePart,
                { text: "Generate a detailed and creative prompt for an AI image generator based on this image. Focus on style, composition, lighting, and key subjects." }
            ]
        },
    });
    return response.text;
};

// Placeholder for Video to Prompt
export const generatePromptFromVideo = async (videoFile: File): Promise<string> => {
    // This is a placeholder. In a real scenario, you'd extract frames from the
    // video and send them to the model to generate a description/prompt.
    // For now, we'll just return a mock response.
    await new Promise(res => setTimeout(res, 1500));
    return `A cinematic prompt based on the video: A high-speed chase through a neon-lit city at night, with rain slicking the streets. The camera follows a futuristic sports car, capturing dynamic angles and lens flares. The overall mood is tense and exciting, with a synthwave soundtrack. (Generated from video: ${videoFile.name})`;
};


export const describeImage = async (imageFile: File): Promise<string> => {
    const imagePart = await fileToGenerativePart(imageFile);
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                imagePart,
                { text: "Describe this image in a detailed and narrative way. Cover the mood, setting, subjects, and potential story behind the scene." }
            ]
        },
    });
    return response.text;
};


export const generateImagePrompt = async (keywords: string): Promise<string> => {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Generate a highly detailed, creative, and evocative prompt for an AI image generator. The prompt should be based on these keywords: "${keywords}". Include details about art style, lighting, composition, colors, and mood.`,
        config: {
            temperature: 1,
            topP: 0.95,
        }
    });
    return response.text;
};

export const generateImagePromptFromTextAndImage = async (keywords: string, imageFile: File): Promise<string> => {
    const imagePart = await fileToGenerativePart(imageFile);
    const textPart = { text: `Generate a highly detailed and creative prompt for an AI image generator. The prompt should be inspired by the provided image, but incorporate these specific keywords: "${keywords}". Focus on blending the image's style, composition, and mood with the new keywords.` };
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
    });
    return response.text;
};

export const generateImage = async (prompt: string): Promise<string> => {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '1:1',
        },
    });
    if (response.generatedImages && response.generatedImages.length > 0) {
        return response.generatedImages[0].image.imageBytes;
    }
    throw new Error("Image generation failed.");
};

export const generateImageFromImage = async (imageFile: File, prompt: string): Promise<{ text: string; image: string; }> => {
    const imagePart = await fileToGenerativePart(imageFile);
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
            parts: [
                imagePart,
                { text: prompt },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    let generatedText = "No text response from model.";
    let generatedImage = "";

    for (const part of response.candidates[0].content.parts) {
        if (part.text) {
            generatedText = part.text;
        } else if (part.inlineData) {
            generatedImage = part.inlineData.data;
        }
    }

    if (!generatedImage) {
        throw new Error("Image to image generation failed to produce an image.");
    }
    
    return { text: generatedText, image: generatedImage };
};


export const generateVideoPrompt = async (keywords: string): Promise<string> => {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Create a cinematic and detailed prompt for an AI video generator based on the following themes: "${keywords}". Describe the scene, camera movement, lighting, color grading, and overall mood.`,
        config: {
            temperature: 1,
            topP: 0.95,
        }
    });
    return response.text;
};

export const generateVideoPromptFromImage = async (imageFile: File): Promise<string> => {
    const imagePart = await fileToGenerativePart(imageFile);
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                imagePart,
                { text: "Based on this image, create a cinematic prompt for an AI video generator. Describe what happens before, during, and after the moment captured in the image. Include details on camera angles, movement, and sound design." }
            ]
        },
    });
    return response.text;
};

export const generateVideoPromptFromTextAndImage = async (keywords: string, imageFile: File): Promise<string> => {
    const imagePart = await fileToGenerativePart(imageFile);
    const textPart = { text: `Based on the provided image and the following keywords: "${keywords}", create a cinematic prompt for an AI video generator. Describe what happens before, during, and after the moment captured in the image, incorporating the keywords. Include details on camera angles, movement, and sound design.` };
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
    });
    return response.text;
};

export const generateVideo = async (prompt: string): Promise<string> => {
    let operation = await ai.models.generateVideos({
        model: 'veo-2.0-generate-001',
        prompt: prompt,
        config: {
            numberOfVideos: 1
        }
    });

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("Video generation failed or returned no URI.");
    }
    
    return downloadLink;
};

export const generateVideoFromImage = async (imageFile: File, prompt: string): Promise<string> => {
    const imagePart = await fileToGenerativePart(imageFile);
    let operation = await ai.models.generateVideos({
        model: 'veo-2.0-generate-001',
        prompt: prompt,
        image: {
            imageBytes: imagePart.inlineData.data,
            mimeType: imagePart.inlineData.mimeType,
        },
        config: {
            numberOfVideos: 1
        }
    });

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("Image to Video generation failed or returned no URI.");
    }
    
    return downloadLink;
};

export const generateAdScript = async (prompt: string, type: 'UGC' | 'CGI' | 'Promotional', imageFile?: File): Promise<any> => {
    const systemInstruction = `You are an expert copywriter and video director. Generate a short, engaging video ad script based on the user's request. The style should be ${type}. The script must be concise and suitable for social media (e.g., TikTok, Instagram Reels). If an image is provided, use it as the primary context for the product or subject.`;
    
    const textPart = { text: prompt };
    const parts: any[] = [textPart];
    if (imageFile) {
        const imagePart = await fileToGenerativePart(imageFile);
        parts.unshift(imagePart);
    }

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts },
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: 'A catchy title for the ad.' },
                    hook: { type: Type.STRING, description: 'A 3-second hook to grab attention.' },
                    scenes: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                scene: { type: Type.INTEGER },
                                visual: { type: Type.STRING, description: 'Description of the visuals for this scene.' },
                                voiceover: { type: Type.STRING, description: 'The voiceover or dialogue for this scene.' },
                            },
                            required: ["scene", "visual", "voiceover"],
                        }
                    },
                    cta: { type: Type.STRING, description: 'A clear call to action.' }
                },
                required: ["title", "hook", "scenes", "cta"],
            },
        },
    });

    return JSON.parse(response.text);
};
