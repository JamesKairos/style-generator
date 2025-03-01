import Image from 'next/image';
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RefreshCw, Copy, Camera } from 'lucide-react';

const StyleGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [modifications, setModifications] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const [styles, setStyles] = useState([
    { 
      name: 'Wyeth Watercolor', 
      weight: 20, 
      characteristics: [
        'Muted earth tones',
        'Dry brush technique',
        'Emotional landscape',
        'Textural details',
        'Limited palette',
        'Atmospheric mood'
      ]
    },
    { 
      name: 'Charcoal Reduction', 
      weight: 20, 
      characteristics: [
        'Dramatic contrast',
        'Eraser highlights',
        'Gestural marks',
        'Layered depth',
        'Atmospheric effects',
        'Dynamic composition'
      ]
    },
    {
      name: 'Yoshitoshi Woodblock',
      weight: 20,
      characteristics: [
        'Bold linework',
        'Theatrical poses',
        'Dramatic narratives',
        'Color blocking',
        'Mythological elements',
        'Precise detail'
      ]
    },
    {
      name: 'Hosoe Photography',
      weight: 20,
      characteristics: [
        'High contrast',
        'Surreal elements',
        'Body abstraction',
        'Empty space usage',
        'Dramatic lighting',
        'Psychological depth'
      ]
    },
    {
      name: 'Kim Jung Gi Ink',
      weight: 20,
      characteristics: [
        'Perspective mastery',
        'Dynamic linework',
        'Complex composition',
        'Narrative detail',
        'Spontaneous flow',
        'Technical precision'
      ]
    }
  ]);

  const generateStylePrompt = () => {
    const activeStyles = styles.sort((a, b) => b.weight - a.weight);
    const primaryStyles = activeStyles.filter(s => s.weight > 30);
    const supportingStyles = activeStyles.filter(s => s.weight <= 30);
    
    let stylePrompt = "Create an image with ";
    
    // Add primary styles
    primaryStyles.forEach((style, index) => {
      stylePrompt += `${style.weight}% influence from ${style.name} (${style.characteristics.slice(0, 2).join(', ')})`;
      if (index < primaryStyles.length - 1) stylePrompt += ", ";
    });
    
    // Add supporting styles
    if (supportingStyles.length > 0) {
      stylePrompt += ", with subtle elements of ";
      supportingStyles.forEach((style, index) => {
        stylePrompt += `${style.name} (${style.characteristics[0]})`;
        if (index < supportingStyles.length - 1) stylePrompt += ", ";
      });
    }
    
    return stylePrompt;
  };

  const generateImages = () => {
    setIsGenerating(true);
    const stylePrompt = generateStylePrompt();
    
    // Simulate image generation with placeholders
    setTimeout(() => {
      const newImages = Array(4).fill(null).map((_, index) => ({
        id: Date.now() + index,
        url: `/api/placeholder/${400}/${400}`,
        prompt: prompt,
        stylePrompt: stylePrompt,
        styles: [...styles]
      }));
      
      setGeneratedImages(newImages);
      setIsGenerating(false);
    }, 1500);
  };

  const modifyImage = () => {
    if (!selectedImage) return;
    
    setIsGenerating(true);
    setTimeout(() => {
      const newImages = Array(4).fill(null).map((_, index) => ({
        id: Date.now() + index,
        url: `/api/placeholder/${400}/${400}`,
        prompt: prompt,
        modifications: modifications,
        styles: [...styles]
      }));
      
      setGeneratedImages(newImages);
      setIsGenerating(false);
    }, 1500);
  };

  const updateWeight = (index, newValue) => {
    const updatedStyles = [...styles];
    updatedStyles[index].weight = newValue[0];
    
    // Normalize weights to sum to 100
    const totalWeight = updatedStyles.reduce((sum, style) => sum + style.weight, 0);
    updatedStyles.forEach(style => {
      style.weight = (style.weight / totalWeight) * 100;
    });
    
    setStyles(updatedStyles);
  };

  return (
    <div className="w-full max-w-6xl space-y-6">
      {/* Prompt Input */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Enter your image prompt..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={generateImages}
                disabled={isGenerating || !prompt}
                className="flex items-center gap-2"
              >
                <Camera className="h-4 w-4" />
                Generate Images
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(generateStylePrompt());
                }}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy Style Prompt
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Style Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Style Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {styles.map((style, index) => (
              <div key={style.name} className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">
                    {style.name}
                  </h3>
                  <span className="text-sm text-gray-500">{Math.round(style.weight)}%</span>
                </div>
                <Slider
                  defaultValue={[style.weight]}
                  max={100}
                  step={1}
                  className="w-full"
                  onValueChange={(value) => updateWeight(index, value)}
                />
                <div className="flex flex-wrap gap-2">
                  {style.characteristics.map((char, i) => (
                    <Badge key={i} variant="secondary">
                      {char}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generated Images */}
      {generatedImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {generatedImages.map((image) => (
                <div 
                  key={image.id}
                  className={`relative rounded-lg overflow-hidden cursor-pointer border-2 ${
                    selectedImage?.id === image.id ? 'border-blue-500' : 'border-transparent'
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <Image
                    src={image.url}
                    alt="Generated artwork"
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modifications */}
      {selectedImage && (
        <Card>
          <CardHeader>
            <CardTitle>Modify Selected Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Describe modifications (e.g., 'make it more dramatic', 'adjust lighting', 'enhance texture')..."
                value={modifications}
                onChange={(e) => setModifications(e.target.value)}
                className="w-full"
              />
              <Button 
                onClick={modifyImage}
                disabled={isGenerating || !modifications}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Apply Modifications
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StyleGenerator;