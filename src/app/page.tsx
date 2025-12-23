"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Send, Loader2, User, Mail, Phone, MapPin, Heart } from "lucide-react";
import { contactSchema, ContactFormData } from "@/lib/schema";
import { useState } from "react";

export default function InscripcionForm() {
  const [isUploading, setIsUploading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsUploading(true);
    const formData = new FormData();
    // Añadimos todos los campos al FormData
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'imagen') {
        formData.append(key, value[0]);
      } else {
        formData.append(key, value as string);
      }
    });

    try {
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      if (response.ok) {
        alert("Inscripción exitosa");
        reset();
      }
    } catch (error) {
      alert("Error al procesar el formulario");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-indigo-700 p-8 text-white">
          <h2 className="text-3xl font-bold italic">Formulario de Inscripción</h2>
          <p className="opacity-90 mt-2">Por favor, completa todos los campos para tu registro.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Nombre y Apellido */}
          <div>
            <label className="text-sm font-semibold flex items-center gap-2"><User size={16}/> Nombre</label>
            <input {...register("nombre")} className="w-full mt-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 text-black" />
            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold italic">Apellido</label>
            <input {...register("apellido")} className="w-full mt-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 text-black" />
            {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido.message}</p>}
          </div>

          {/* Email y Teléfono */}
          <div>
            <label className="text-sm font-semibold flex items-center gap-2"><Mail size={16}/> Correo Electrónico</label>
            <input type="email" {...register("email")} className="w-full mt-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 text-black" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold flex items-center gap-2"><Phone size={16}/> Teléfono</label>
            <input {...register("telefono")} className="w-full mt-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 text-black" />
            {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono.message}</p>}
          </div>

          {/* Diócesis y Salud */}
          <div>
            <label className="text-sm font-semibold flex items-center gap-2"><MapPin size={16}/> Diócesis</label>
            <input {...register("diocesis")} className="w-full mt-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 text-black" />
            {errors.diocesis && <p className="text-red-500 text-xs mt-1">{errors.diocesis.message}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold flex items-center gap-2"><Heart size={16}/> Entidad de Salud</label>
            <input {...register("entidadSalud")} className="w-full mt-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 text-black" />
            {errors.entidadSalud && <p className="text-red-500 text-xs mt-1">{errors.entidadSalud.message}</p>}
          </div>

          {/* Segmentación y Hospedaje */}
          <div>
            <label className="text-sm font-semibold block">Usted es:</label>
            <select {...register("segmentacion")} className="w-full mt-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 text-black">
              <option value="">Seleccione...</option>
              <option value="sacerdote">Sacerdote</option>
              <option value="seminarista">Seminarista</option>
              <option value="laico">Laico</option>
            </select>
            {errors.segmentacion && <p className="text-red-500 text-xs mt-1">{errors.segmentacion.message}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold block text-indigo-700">¿Requiere Hospedaje?</label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-1"><input type="radio" value="si" {...register("hospedaje")} /> Sí</label>
              <label className="flex items-center gap-1"><input type="radio" value="no" {...register("hospedaje")} /> No</label>
            </div>
            {errors.hospedaje && <p className="text-red-500 text-xs mt-1">{errors.hospedaje.message}</p>}
          </div>

          {/* Foto de perfil */}
          <div className="md:col-span-2">
            <label className="text-sm font-semibold block mb-2">Sube tu fotografía</label>
            <div className="relative border-2 border-dashed border-indigo-200 rounded-2xl p-6 hover:bg-indigo-50 transition-all text-center">
              <input type="file" {...register("imagen")} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
              <Camera className="mx-auto h-10 w-10 text-indigo-300" />
              <p className="text-xs text-indigo-500 mt-2 font-medium">Click para cargar imagen de identificación</p>
            </div>
            {errors.imagen && <p className="text-red-500 text-xs mt-1 text-center">{String(errors.imagen.message)}</p>}
          </div>

          <button 
            disabled={isUploading} 
            className="md:col-span-2 w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
          >
            {isUploading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
            {isUploading ? "Enviando Registro..." : "Confirmar Inscripción"}
          </button>
        </form>
      </div>
    </main>
  );
}