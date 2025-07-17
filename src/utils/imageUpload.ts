import { supabase } from '../lib/supabase';

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Uploads an image file to Supabase storage and returns the public URL
 */
export async function uploadImageToStorage(file: File): Promise<ImageUploadResult> {
  try {
    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `course-images/${fileName}`;

    // Upload the file to Supabase storage
    const { data, error } = await supabase.storage
      .from('course-content')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading image:', error);
      return { success: false, error: error.message };
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('course-content')
      .getPublicUrl(filePath);

    return { 
      success: true, 
      url: urlData.publicUrl 
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

/**
 * Handles paste events and automatically uploads images
 */
export function handleImagePaste(
  event: ClipboardEvent,
  onImageUploaded: (markdownText: string) => void,
  onError: (error: string) => void
) {
  const items = event.clipboardData?.items;
  if (!items) return;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    
    // Check if the item is an image
    if (item.type.indexOf('image') !== -1) {
      event.preventDefault(); // Prevent default paste behavior
      
      const file = item.getAsFile();
      if (!file) continue;

      // Show loading state (you can customize this)
      const loadingText = `![Uploading image...](uploading)`;
      onImageUploaded(loadingText);

      // Upload the image
      uploadImageToStorage(file)
        .then((result) => {
          if (result.success && result.url) {
            // Replace loading text with actual image markdown
            const imageMarkdown = `![Image](${result.url})`;
            onImageUploaded(imageMarkdown);
          } else {
            onError(result.error || 'Failed to upload image');
            // Remove loading text on error
            onImageUploaded('');
          }
        })
        .catch((error) => {
          onError(error.message || 'Failed to upload image');
          // Remove loading text on error
          onImageUploaded('');
        });
      
      break; // Only handle the first image
    }
  }
}

/**
 * Creates a storage bucket if it doesn't exist
 */
export async function ensureStorageBucket() {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return false;
    }

    const bucketExists = buckets?.some(bucket => bucket.name === 'course-content');
    
    if (!bucketExists) {
      // Create the bucket
      const { error: createError } = await supabase.storage.createBucket('course-content', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB
      });

      if (createError) {
        console.error('Error creating bucket:', createError);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error ensuring storage bucket:', error);
    return false;
  }
}
