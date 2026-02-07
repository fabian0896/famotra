import type { BankInsert } from '@/modules/admin/models/banks.models';
import { supabase } from '@/integrations/supabase/client';

const BANKS_BUCKET_NAME = 'bank-icons';

export class BanksAdminService {
  static async uploadLogo(file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    const { error } = await supabase.storage.from(BANKS_BUCKET_NAME).upload(fileName, file);
    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from(BANKS_BUCKET_NAME).getPublicUrl(fileName);

    return publicUrl;
  }

  static async create(data: BankInsert) {
    await supabase.from('bank_list').insert(data).throwOnError();
  }

  static async upsert(data: BankInsert) {
    await supabase.from('bank_list').upsert(data).throwOnError();
  }

  static async remove(data: { id: string }) {
    await supabase.from('bank_list').delete().eq('id', data.id).single().throwOnError();
  }
}
