const SUPABASE_URL = "https://gjfzcmwvtazhzsbrwczy.supabase.co/rest/v1/";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_nUSofw_iUOmx76nQ3AaNBQ_LKSlayRq";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);
