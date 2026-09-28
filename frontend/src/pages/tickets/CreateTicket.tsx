import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ticketAPI, websiteAPI } from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Building, Calendar, Clock, Loader2, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  judul: z.string().min(1, "Judul wajib diisi").max(255, "Judul terlalu panjang"),
  deskripsi: z.string().min(1, "Deskripsi wajib diisi"),
  jenis: z.enum(["perbaikan_website", "maintenance", "konsultasi", "lainnya"]),
  prioritas: z.enum(["rendah", "sedang", "tinggi", "mendesak"]),
  nama_holding: z.string().min(1, "Nama holding wajib diisi").max(255, "Nama holding terlalu panjang"),
  pic_nama: z.string().min(1, "Nama PIC wajib diisi").max(255, "Nama PIC terlalu panjang"),
  detail_masalah: z.string().min(1, "Detail masalah wajib diisi"),
  tanggal_kunjungan_diinginkan: z.string().optional(),
  waktu_kunjungan_diinginkan: z.string().optional(),
  website_url: z.string().url("URL tidak valid").optional().or(z.literal("")),
});

type FormData = z.infer<typeof formSchema>;

const CreateTicket = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userHolding, setUserHolding] = useState<string>("");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      judul: "",
      deskripsi: "",
      jenis: "perbaikan_website",
      prioritas: "sedang",
      nama_holding: "",
      pic_nama: "",
      detail_masalah: "",
      tanggal_kunjungan_diinginkan: "",
      waktu_kunjungan_diinginkan: "",
      website_url: "",
    },
  });

  // Load user holding on mount
  useEffect(() => {
    const loadUserHolding = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          
          // If user is ticketing_user with holding_id
          if ((user.role === 'ticketing_user' || user.role === 'user_tiket') && user.holding_id) {
            if (user.holding_name) {
              setUserHolding(user.holding_name);
              form.setValue('nama_holding', user.holding_name);
            } else {
              const websitesRes = await websiteAPI.getAll();
              const websites = websitesRes.data || [];
              const holding = websites.find((w: any) => w.id === user.holding_id);
              
              if (holding) {
                setUserHolding(holding.holding);
                form.setValue('nama_holding', holding.holding);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error loading user holding:', error);
      }
    };

    loadUserHolding();
  }, [form]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const submitData = {
        ...data,
        website_url: data.website_url || undefined,
        tanggal_kunjungan_diinginkan: data.tanggal_kunjungan_diinginkan || undefined,
        waktu_kunjungan_diinginkan: data.waktu_kunjungan_diinginkan || undefined,
      };

      await ticketAPI.create(submitData);
      toast.success('Tiket berhasil dibuat!');
      
      // Redirect to tickets page
      setTimeout(() => {
        navigate('/tickets', { replace: true });
      }, 500);
    } catch (error: any) {
      console.error('Error creating ticket:', error);
      const errorMessage = error.response?.data?.message || 'Gagal membuat tiket';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/tickets">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Tiket
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Buat Tiket Dukungan</h1>
          <p className="text-muted-foreground">Ajukan permintaan untuk perbaikan website atau kunjungan maintenance</p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Dasar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FieldGroup>
                  <Controller
                    name="judul"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <label className="text-sm font-medium">Judul *</label>
                        <Input
                          {...field}
                          placeholder="Deskripsi singkat masalah"
                          disabled={isSubmitting}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </FieldGroup>

                <FieldGroup>
                  <Controller
                    name="deskripsi"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <label className="text-sm font-medium">Deskripsi *</label>
                        <Textarea
                          {...field}
                          placeholder="Deskripsi detail tentang bantuan yang dibutuhkan"
                          rows={3}
                          disabled={isSubmitting}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </FieldGroup>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FieldGroup>
                    <Controller
                      name="jenis"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <label className="text-sm font-medium">Jenis Permintaan *</label>
                          <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih jenis permintaan" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="perbaikan_website">Perbaikan Website</SelectItem>
                              <SelectItem value="maintenance">Maintenance</SelectItem>
                              <SelectItem value="konsultasi">Konsultasi</SelectItem>
                              <SelectItem value="lainnya">Lainnya</SelectItem>
                            </SelectContent>
                          </Select>
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  </FieldGroup>

                  <FieldGroup>
                    <Controller
                      name="prioritas"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <label className="text-sm font-medium">Prioritas *</label>
                          <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih prioritas" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="rendah">Rendah</SelectItem>
                              <SelectItem value="sedang">Sedang</SelectItem>
                              <SelectItem value="tinggi">Tinggi</SelectItem>
                              <SelectItem value="mendesak">Mendesak</SelectItem>
                            </SelectContent>
                          </Select>
                          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                      )}
                    />
                  </FieldGroup>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Kontak</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FieldGroup>
                  <Controller
                    name="nama_holding"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <label className="text-sm font-medium">Nama Holding *</label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            placeholder="Nama perusahaan holding"
                            className="pl-10"
                            disabled={isSubmitting || !!userHolding}
                          />
                        </div>
                        {userHolding && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Holding Anda: {userHolding}
                          </p>
                        )}
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </FieldGroup>

                <FieldGroup>
                  <Controller
                    name="pic_nama"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <label className="text-sm font-medium">Nama PIC *</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            placeholder="Nama lengkap Person In Charge"
                            className="pl-10"
                            disabled={isSubmitting}
                          />
                        </div>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </FieldGroup>

                <FieldGroup>
                  <Controller
                    name="detail_masalah"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <label className="text-sm font-medium">Detail Masalah *</label>
                        <Textarea
                          {...field}
                          placeholder="Jelaskan masalah spesifik yang dialami, pesan error, atau hal yang perlu diperbaiki/dimaintenance"
                          rows={3}
                          disabled={isSubmitting}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Visit Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Jadwal Kunjungan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FieldGroup>
                  <Controller
                    name="tanggal_kunjungan_diinginkan"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <label className="text-sm font-medium">Tanggal yang Diinginkan</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            type="date"
                            className="pl-10"
                            disabled={isSubmitting}
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </FieldGroup>

                <FieldGroup>
                  <Controller
                    name="waktu_kunjungan_diinginkan"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <label className="text-sm font-medium">Waktu yang Diinginkan</label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            type="time"
                            className="pl-10"
                            disabled={isSubmitting}
                          />
                        </div>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </FieldGroup>

                <div className="text-sm text-muted-foreground">
                  <p>Catatan: Jadwal kunjungan tergantung ketersediaan dan akan dikonfirmasi oleh tim kami.</p>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Card>
              <CardContent className="pt-6">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {isSubmitting ? "Membuat Tiket..." : "Buat Tiket"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateTicket;
