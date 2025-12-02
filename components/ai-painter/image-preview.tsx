"use client"

import * as React from "react"
import { Download, X, ZoomIn, ZoomOut } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ImagePreviewProps {
  imageUrl: string | null
  onClose: () => void
}

export function ImagePreview({ imageUrl, onClose }: ImagePreviewProps) {
  const [scale, setScale] = React.useState(1)

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5))
  }

  const handleDownload = async () => {
    if (!imageUrl) return

    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `ai-art-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  React.useEffect(() => {
    // Reset scale when image changes
    setScale(1)
  }, [imageUrl])

  return (
    <Dialog open={!!imageUrl} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl overflow-hidden p-0">
        <DialogHeader className="absolute inset-x-0 top-0 z-10 flex flex-row items-center justify-between bg-gradient-to-b from-black/50 to-transparent p-4">
          <DialogTitle className="text-white">Image Preview</DialogTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={handleZoomOut}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="min-w-12 text-center text-sm text-white">
              {Math.round(scale * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={handleZoomIn}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex max-h-[80vh] min-h-[60vh] items-center justify-center overflow-auto bg-black/90 p-8">
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="max-h-full max-w-full object-contain transition-transform duration-200"
              style={{ transform: `scale(${scale})` }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

