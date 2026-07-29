import supabase from "../config/supabase.js";

export const uploadToSupabase = async (file, folder = "images") => {
  if (!file) return null;

  const fileName = `${folder}/${Date.now()}-${file.originalname}`;

  const { error } = await supabase.storage
    .from(process.env.SUPABASE_BUCKET)
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from(process.env.SUPABASE_BUCKET)
    .getPublicUrl(fileName);

  return data.publicUrl;
};

export const deleteFromSupabase = async (publicUrl) => {
  if (!publicUrl) return;

  const bucket = process.env.SUPABASE_BUCKET;
  const marker = `/storage/v1/object/public/${bucket}/`;

  const index = publicUrl.indexOf(marker);
  if (index === -1) return;

  const filePath = publicUrl.slice(index + marker.length);

  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath]);

  if (error) throw error;
};