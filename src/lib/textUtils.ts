export const formatTextGradients = (text: any): string => {
  if (!text || typeof text !== 'string') {
    return text ? String(text) : "";
  }
  
  return text
    .replace(/--(.*?)--/g, '<span class="text-gradient-sunset-glow">$1</span>')
    .replace(/\*\*(.*?)\*\*/g, '<span class="text-gradient-cyber-blue">$1</span>')
    .replace(/!!(.*?)!!/g, '<span class="text-gradient-luxury-gold">$1</span>')
    .replace(/~~(.*?)~~/g, '<span class="text-gradient-digital-ocean">$1</span>')
    .replace(/&&(.*?)&&/g, '<span class="text-gradient-vivid-pink">$1</span>')
    .replace(/\[\[(.*?)\]\]/g, '<span class="text-gradient-creative-plum">$1</span>')
    .replace(/\{\{(.*?)\}\}/g, '<span class="text-gradient-neon-tech">$1</span>')
    .replace(/\+\+(.*?)\+\+/g, '<span class="text-gradient-deep-space">$1</span>')
    .replace(/==(.*?)==/g, '<span class="text-gradient-matrix-code">$1</span>')
    .replace(/\^\^(.*?)\^\^/g, '<span class="text-gradient-royal-amber">$1</span>')
    .replace(/%%(.*?)%%/g, '<span class="text-gradient-hot-flame">$1</span>')
    .replace(/\$\$(.*?)\$\$/g, '<span class="text-gradient-rich-success">$1</span>')
    .replace(/@@(.*?)@@/g, '<span class="text-gradient-neon-purp">$1</span>')
    .replace(/>>(.*?)>>/g, '<span class="text-gradient-magic-dust">$1</span>')
    .replace(/<<(.*?)<</g, '<span class="text-gradient-unicorn">$1</span>')
    .replace(/\?\?(.*?)\?\?/g, '<span class="text-gradient-cool-gray">$1</span>')
    .replace(/::(.*?)::/g, '<span class="text-gradient-silver-dark">$1</span>')
    .replace(/,,(.*?),,/g, '<span class="text-gradient-forest-fog">$1</span>')
    .replace(/vv(.*?)vv/g, '<span class="text-gradient-midnight">$1</span>')
    .replace(/;;(.*?);;/g, '<span class="text-gradient-ocean-pearl">$1</span>');
};
