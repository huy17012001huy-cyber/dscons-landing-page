const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'admin', 'Dashboard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// The file has massive duplicate imports at the top
const firstImport = 'import HeroPreview from "@/components/sections/HeroSection";';
const firstImportIndex = content.indexOf(firstImport);
const secondImportIndex = content.indexOf(firstImport, firstImportIndex + 1);

if (firstImportIndex !== -1 && secondImportIndex !== -1) {
    // Keep everything before the first import (if any) and from the second import onwards
    // Wait, let's see which one is more "correct"
    // Usually the second one is the one we want if we appended or prepended
    
    // Actually, let's just find the start of the component 'export default function Dashboard()'
    const componentStart = 'export default function Dashboard()';
    const componentStartIndex = content.indexOf(componentStart);
    
    if (componentStartIndex !== -1) {
        const body = content.substring(componentStartIndex);
        
        const correctImports = `import HeroPreview from "@/components/sections/HeroSection";
import PainPointsPreview from "@/components/sections/PainPoints";
import SolutionPreview from "@/components/sections/Solution";
import CurriculumPreview from "@/components/sections/Curriculum";
import BonusPreview from "@/components/sections/Bonus";
import InstructorPreview from "@/components/sections/Instructor";
import PricingPreview from "@/components/sections/Pricing";
import FAQPreview from "@/components/sections/FAQ";
import ComparisonPreview from "@/components/landing/CourseComparison";
import NavbarPreview from "@/components/landing/Navbar";
import OutcomesPreview from "@/components/sections/Outcomes";
import TestimonialsPreview from "@/components/sections/Testimonials";
import BottomCTAPreview from "@/components/sections/BottomCTA";
import Footer from "@/components/landing/Footer";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  LogOut, LayoutDashboard, Type, ImageIcon, List, Settings, Save, UploadCloud, 
  EyeOff, Loader2, Eye, X, Gift, Key, Globe, LayoutTemplate, AlertCircle, 
  CheckCircle2, Map, Trophy, Users, MessageSquare, CreditCard, HelpCircle, 
  Scale, MousePointerClick, Palette, Bot
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { getLandingPages, getSectionData, saveDraft, publishSection, getCompetitorQueries, toggleVisibility, SectionData, getPageStats } from "@/lib/api";
import { landingData } from "@/data/landingContent";
import { IconSelector } from "@/components/admin/IconSelector";
import { LandingPageManager } from "@/components/admin/LandingPageManager";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Switch from "@/components/ui/sky-toggle";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { motion, AnimatePresence } from "framer-motion";

`;
        fs.writeFileSync(filePath, correctImports + body);
        console.log('Successfully cleaned up duplicate imports in Dashboard.tsx.');
    }
} else {
    console.log('Could not find duplicate imports.');
}
