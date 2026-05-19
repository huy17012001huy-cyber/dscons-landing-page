import RegistrationForm from "@/components/sections/RegistrationForm";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  return (
    <div className="dark min-h-screen bg-background text-foreground font-sans relative">
      <div className="absolute top-4 left-4 z-50">
        <Link 
          to="/" 
          className="flex items-center gap-2 px-4 py-2 bg-background/50 backdrop-blur border border-white/10 rounded-full text-sm font-medium hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại trang chủ
        </Link>
      </div>
      <RegistrationForm />
    </div>
  );
};

export default RegisterPage;
