export interface StyleOption {
  id: string
  name: string
  nameEn: string
  prompt: string
  icon?: string
  description?: string
}

export interface ModelOption {
  id: string
  name: string
  apiModel: string
  description?: string
  isDefault?: boolean
}

export const imageModels: ModelOption[] = [
  {
    id: "nano-banana-pro",
    name: "Nano Banana Pro 🍌",
    apiModel: "gemini-3-pro-image-preview",
    description: "Best quality, slower generation",
    isDefault: true,
  },
  {
    id: "nano-banana",
    name: "Nano Banana 🍌",
    apiModel: "gemini-2.5-flash-image",
    description: "Balanced quality and speed",
  },
  {
    id: "imagen4",
    name: "Imagen 4",
    apiModel: "imagen-4.0-generate-001",
    description: "Google's latest image model",
  },
  {
    id: "imagen4-fast",
    name: "Imagen 4 Fast",
    apiModel: "imagen-4.0-fast-generate-001",
    description: "Fast generation, good quality",
  },
  {
    id: "imagen4-ultra",
    name: "Imagen 4 Ultra",
    apiModel: "imagen-4.0-ultra-generate-001",
    description: "Highest quality, premium",
  },
]

export function getModelById(id: string): ModelOption | undefined {
  return imageModels.find((model) => model.id === id)
}

export function getDefaultModel(): ModelOption {
  return imageModels.find((model) => model.isDefault) || imageModels[0]
}

export const presetStyles: StyleOption[] = [
  {
    id: "realistic",
    name: "Realistic",
    nameEn: "Realistic",
    prompt: "photorealistic, high detail, sharp focus, professional photography",
    description: "Photorealistic style with high definition details",
  },
  {
    id: "anime",
    name: "Anime",
    nameEn: "Anime",
    prompt: "anime style, vibrant colors, detailed illustration, anime art",
    description: "Japanese anime style",
  },
  {
    id: "oil-painting",
    name: "Oil Painting",
    nameEn: "Oil Painting",
    prompt: "oil painting style, textured brush strokes, classical art, masterpiece",
    description: "Classical oil painting style",
  },
  {
    id: "watercolor",
    name: "Watercolor",
    nameEn: "Watercolor",
    prompt: "watercolor painting, soft colors, flowing paint, artistic watercolor",
    description: "Fresh and soft watercolor style",
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    nameEn: "Cyberpunk",
    prompt: "cyberpunk style, neon lights, futuristic, dark atmosphere, sci-fi",
    description: "Futuristic sci-fi neon style",
  },
  {
    id: "minimalist",
    name: "Minimalist",
    nameEn: "Minimalist",
    prompt: "minimalist style, clean lines, simple composition, modern design",
    description: "Simple and modern design style",
  },
  {
    id: "3d-render",
    name: "3D Render",
    nameEn: "3D Render",
    prompt: "3D render, octane render, cinema 4d, high quality 3D art, realistic lighting",
    description: "High quality 3D rendering style",
  },
  {
    id: "pixel-art",
    name: "Pixel Art",
    nameEn: "Pixel Art",
    prompt: "pixel art style, 8-bit, retro gaming aesthetic, pixelated",
    description: "Retro pixel game style",
  },
  {
    id: "sketch",
    name: "Sketch",
    nameEn: "Sketch",
    prompt: "pencil sketch, hand drawn, detailed line art, graphite drawing",
    description: "Pencil sketch hand-drawn style",
  },
  {
    id: "pop-art",
    name: "Pop Art",
    nameEn: "Pop Art",
    prompt: "pop art style, bold colors, comic book style, Andy Warhol inspired",
    description: "Andy Warhol pop art style",
  },
  {
    id: "impressionist",
    name: "Impressionist",
    nameEn: "Impressionist",
    prompt: "impressionist painting, Monet style, soft brush strokes, light and color",
    description: "Monet impressionist style",
  },
  {
    id: "fantasy",
    name: "Fantasy",
    nameEn: "Fantasy",
    prompt: "fantasy art, magical, ethereal, detailed illustration, epic fantasy",
    description: "Magical and epic fantasy style",
  },
]

export const aspectRatios = [
  { id: "1:1", name: "1:1 Square", width: 1024, height: 1024 },
  { id: "16:9", name: "16:9 Landscape", width: 1024, height: 576 },
  { id: "9:16", name: "9:16 Portrait", width: 576, height: 1024 },
  { id: "4:3", name: "4:3 Standard", width: 1024, height: 768 },
  { id: "3:4", name: "3:4 Portrait", width: 768, height: 1024 },
]

export function getStyleById(id: string): StyleOption | undefined {
  return presetStyles.find((style) => style.id === id)
}

export function getStylePrompt(id: string): string {
  const style = getStyleById(id)
  return style?.prompt || ""
}

