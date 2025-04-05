'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const pestReportSchema = z.object({
  pestType: z.string().min(1, 'Pest type is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  severity: z.enum(['low', 'medium', 'high']),
  location: z.object({
    lat: z.number(),
    lng: z.number()
  })
});

export default function PestReportForm() {
  const [images, setImages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(pestReportSchema)
  });

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
    });

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      setImages(prev => [...prev, data.secure_url]);
    } catch (error) {
      toast.error('Failed to upload images');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast.error('Failed to start recording');
    }
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      const formData = new FormData();
      formData.append('file', audioBlob);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

      try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`, {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        setValue('voiceNote', data.secure_url);
      } catch (error) {
        toast.error('Failed to upload voice note');
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await fetch('/api/pest-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          images,
        }),
      });

      if (response.ok) {
        toast.success('Pest report submitted successfully');
        // Redirect to success page or clear form
      } else {
        toast.error('Failed to submit pest report');
      }
    } catch (error) {
      toast.error('An error occurred while submitting the report');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Pest Type</label>
        <Input {...register('pestType')} />
        {errors.pestType && <p className="text-red-500 text-sm">{errors.pestType.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <Textarea {...register('description')} />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Severity</label>
        <Select onValueChange={(value) => setValue('severity', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
        {errors.severity && <p className="text-red-500 text-sm">{errors.severity.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Images</label>
        <Input type="file" multiple accept="image/*" onChange={handleImageUpload} />
        <div className="mt-2 grid grid-cols-3 gap-2">
          {images.map((url, index) => (
            <img key={index} src={url} alt={`Pest image ${index + 1}`} className="w-full h-24 object-cover rounded" />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Voice Note</label>
        <Button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          variant={isRecording ? "destructive" : "default"}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Button>
      </div>

      <Button type="submit" className="w-full">Submit Report</Button>
    </form>
  );
} 