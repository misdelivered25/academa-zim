import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import CosmicBackground from "@/components/CosmicBackground";
import { 
  Download, 
  Smartphone, 
  Wifi, 
  Bell, 
  Zap, 
  CheckCircle,
  Share,
  PlusSquare,
  MoreVertical
} from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const checkStandalone = () => {
      const isStandaloneMode = 
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true;
      setIsStandalone(isStandaloneMode);
    };
    
    checkStandalone();

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Listen for install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const features = [
    { icon: Wifi, title: "Works Offline", description: "Access your content even without internet" },
    { icon: Zap, title: "Lightning Fast", description: "Instant load times with cached content" },
    { icon: Bell, title: "Push Notifications", description: "Get study reminders and updates" },
    { icon: Smartphone, title: "Native Feel", description: "Feels like a real app on your device" },
  ];

  if (isStandalone) {
    return (
      <div className="min-h-screen bg-background relative">
        <CosmicBackground showStars={true} showShootingStars={true} overlayOpacity={95} />
        <Header />
        <main className="relative z-10 container-responsive py-12">
          <Card className="max-w-md mx-auto glass-card border-border/30">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Already Installed!</h2>
              <p className="text-muted-foreground">
                You're already using ZimUni Hub as an installed app. Enjoy the full experience!
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative pb-20">
      <CosmicBackground showStars={true} showShootingStars={true} overlayOpacity={95} />
      <Header />
      
      <main className="relative z-10 container-responsive py-8 md:py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Hero */}
          <div className="text-center space-y-4">
            <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
              <Download className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Install ZimUni Hub
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Add ZimUni Hub to your home screen for a faster, app-like experience
            </p>
          </div>

          {/* Install Button or Instructions */}
          <Card className="glass-card border-border/30">
            <CardHeader>
              <CardTitle className="text-center">
                {isInstalled ? "Installation Complete!" : "Ready to Install"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {isInstalled ? (
              <div className="text-center py-4">
                <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">
                  ZimUni Hub has been installed. Check your home screen!
                </p>
              </div>
              ) : deferredPrompt ? (
                <Button 
                  onClick={handleInstall} 
                  size="lg" 
                  className="w-full bg-gradient-hero btn-glow"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Install App
                </Button>
              ) : isIOS ? (
                <div className="space-y-4">
                  <p className="text-center text-muted-foreground">
                    To install on iOS:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                      <Share className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm">1. Tap the <strong>Share</strong> button in Safari</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                      <PlusSquare className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm">2. Scroll down and tap <strong>Add to Home Screen</strong></span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm">3. Tap <strong>Add</strong> to confirm</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-center text-muted-foreground">
                    To install on Android:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                      <MoreVertical className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm">1. Tap the <strong>menu</strong> button (⋮) in Chrome</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                      <PlusSquare className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm">2. Tap <strong>Add to Home screen</strong></span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm">3. Tap <strong>Add</strong> to confirm</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="glass-card border-border/30">
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Install;
