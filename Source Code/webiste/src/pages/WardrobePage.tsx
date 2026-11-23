import {
  Calendar,
  Camera,
  Filter,
  Grid3x3,
  Heart,
  List,
  Loader2,
  Palette,
  Plus,
  Search,
  Shirt,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Upload,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { ImageWithFallback } from "../components/common/ImageWithFallback";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

interface ClothingItem {
  id: string;
  name: string;
  category: string;
  color: string;
  imageUrl: string;
  brand?: string;
  timesWorn: number;
  lastWorn?: Date;
  tags: string[];
  favorite: boolean;
}

interface ClassificationResult {
  caption: string;
  color: string;
  type: string;
}

export function WardrobePage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Image Classification States
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [classifying, setClassifying] = useState(false);
  const [classificationResult, setClassificationResult] =
    useState<ClassificationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock wardrobe data
  const [wardrobeItems] = useState<ClothingItem[]>([
    {
      id: "1",
      name: "Black Slim Jeans",
      category: "bottoms",
      color: "#1a1a1a",
      imageUrl:
        "https://images.unsplash.com/photo-1639602182178-2dc689354103?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXN1YWwlMjBqZWFucyUyMGRlbmltfGVufDF8fHx8MTc2MTM2MjUwM3ww&ixlib=rb-4.1.0&q=80&w=400",
      brand: "Levi's",
      timesWorn: 15,
      lastWorn: new Date("2024-10-20"),
      tags: ["casual", "everyday"],
      favorite: true,
    },
    {
      id: "2",
      name: "White Button-Up Shirt",
      category: "tops",
      color: "#ffffff",
      imageUrl:
        "https://images.unsplash.com/photo-1760545183001-af3b64500b0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmVzcyUyMHNoaXJ0JTIwZm9ybWFsfGVufDF8fHx8MTc2MTMxNTQ0Mnww&ixlib=rb-4.1.0&q=80&w=400",
      brand: "Brooks Brothers",
      timesWorn: 8,
      lastWorn: new Date("2024-10-18"),
      tags: ["formal", "work"],
      favorite: false,
    },
    {
      id: "3",
      name: "Beige Blazer",
      category: "outerwear",
      color: "#d4c4a8",
      imageUrl:
        "https://images.unsplash.com/photo-1760939065084-ffe89e085de8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG90aGluZyUyMGl0ZW1zJTIwaGFuZ2luZ3xlbnwxfHx8fDE3NjEzNjI1MDJ8MA&ixlib=rb-4.1.0&q=80&w=400",
      brand: "Zara",
      timesWorn: 5,
      lastWorn: new Date("2024-10-15"),
      tags: ["formal", "smart-casual"],
      favorite: true,
    },
    {
      id: "4",
      name: "Grey Hoodie",
      category: "tops",
      color: "#808080",
      imageUrl:
        "https://images.unsplash.com/photo-1736697421338-c361795c7191?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwd2FyZHJvYmUlMjBjbG9zZXR8ZW58MXx8fHwxNzYxMzYyNTAxfDA&ixlib=rb-4.1.0&q=80&w=400",
      brand: "Nike",
      timesWorn: 22,
      lastWorn: new Date("2024-10-22"),
      tags: ["casual", "athleisure"],
      favorite: true,
    },
    {
      id: "5",
      name: "Navy Blue Chinos",
      category: "bottoms",
      color: "#1e3a5f",
      imageUrl:
        "https://images.unsplash.com/photo-1569388330292-79cc1ec67270?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzYxMjk1MzIwfDA&ixlib=rb-4.1.0&q=80&w=400",
      brand: "H&M",
      timesWorn: 12,
      lastWorn: new Date("2024-10-19"),
      tags: ["smart-casual", "work"],
      favorite: false,
    },
    {
      id: "6",
      name: "Leather Jacket",
      category: "outerwear",
      color: "#2e1f13",
      imageUrl:
        "https://images.unsplash.com/photo-1736697421338-c361795c7191?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwd2FyZHJvYmUlMjBjbG9zZXR8ZW58MXx8fHwxNzYxMzYyNTAxfDA&ixlib=rb-4.1.0&q=80&w=400",
      brand: "AllSaints",
      timesWorn: 7,
      lastWorn: new Date("2024-10-16"),
      tags: ["casual", "streetwear"],
      favorite: true,
    },
  ]);

  const categories = [
    { value: "all", label: "All Items", icon: Grid3x3 },
    { value: "tops", label: "Tops", icon: Shirt },
    { value: "bottoms", label: "Bottoms", icon: ShoppingBag },
    { value: "outerwear", label: "Outerwear", icon: Shirt },
    { value: "accessories", label: "Accessories", icon: Sparkles },
  ];

  const filteredItems = wardrobeItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = [
    {
      label: "Total Items",
      value: wardrobeItems.length,
      icon: ShoppingBag,
      color: "#8B5CF6",
    },
    {
      label: "Favorites",
      value: wardrobeItems.filter((i) => i.favorite).length,
      icon: Heart,
      color: "#EC4899",
    },
    {
      label: "Most Worn",
      value: Math.max(...wardrobeItems.map((i) => i.timesWorn)),
      icon: TrendingUp,
      color: "#10B981",
    },
    {
      label: "Categories",
      value: new Set(wardrobeItems.map((i) => i.category)).size,
      icon: Palette,
      color: "#F59E0B",
    },
  ];

  // Image Classification Functions
  const validateFileType = (file: File): boolean => {
    console.log("📋 Validating file type:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
    const isValid = allowedTypes.includes(file.type.toLowerCase());

    console.log("✅ File validation result:", {
      isValid,
      allowedTypes,
      actualType: file.type.toLowerCase(),
    });

    return isValid;
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("📂 File input changed");
    const file = event.target.files?.[0];

    if (file) {
      console.log("📁 File selected via input:", file.name);
      if (validateFileType(file)) {
        console.log("✅ File type valid, setting selected image");
        setSelectedImage(file);
      } else {
        console.log("❌ Invalid file type");
        alert("Please select only PNG, JPG, or JPEG files");
      }
    } else {
      console.log("❌ No file selected");
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    console.log("🎯 File dropped");
    event.preventDefault();

    const files = event.dataTransfer.files;
    console.log("📁 Dropped files count:", files.length);

    const file = files[0];
    if (file) {
      console.log("📁 First dropped file:", {
        name: file.name,
        type: file.type,
        size: file.size,
      });

      if (validateFileType(file)) {
        console.log("✅ Dropped file type valid, setting selected image");
        setSelectedImage(file);
      } else {
        console.log("❌ Invalid dropped file type");
        alert("Please select only PNG, JPG, or JPEG files");
      }
    } else {
      console.log("❌ No dropped file found");
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    console.log("🎯 Drag over");
  };

  const classifyImage = async () => {
    console.log("🔍 Starting image classification...");

    if (!selectedImage) {
      console.log("❌ No image selected");
      return;
    }

    console.log("📁 Selected image:", {
      name: selectedImage.name,
      size: selectedImage.size,
      type: selectedImage.type,
      lastModified: selectedImage.lastModified,
    });

    // Validate file size (10MB limit)
    if (selectedImage.size > 10 * 1024 * 1024) {
      console.log("❌ File too large:", selectedImage.size);
      alert("File size must be less than 10MB");
      return;
    }

    setClassifying(true);
    console.log("⏳ Setting classifying state to true");

    try {
      console.log("📖 Starting file reader...");
      // Convert image to base64
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          console.log("✅ File read successfully");
          const base64Data = e.target?.result as string;

          console.log("📊 Base64 data info:", {
            length: base64Data.length,
            starts_with: base64Data.substring(0, 50) + "...",
            type: base64Data.split(";")[0],
          });

          const apiUrl = import.meta.env.VITE_API_URL;
          const classifyUrl = `${apiUrl}/classify`;

          const response = await fetch(classifyUrl, {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              image: base64Data,
            }),
          });

          console.log("📬 Response received:", {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            headers: Object.fromEntries(response.headers.entries()),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.log("❌ Response not OK, error text:", errorText);
            throw new Error(
              `Classification failed: ${response.status} ${response.statusText} - ${errorText}`
            );
          }

          console.log("🎯 Parsing JSON response...");

          // Check if response is actually JSON
          const contentType = response.headers.get("content-type");
          console.log("📋 Response content type:", contentType);

          if (!contentType || !contentType.includes("application/json")) {
            const textResponse = await response.text();
            console.log(
              "❌ Expected JSON but got:",
              textResponse.substring(0, 200) + "..."
            );
            throw new Error(
              `Expected JSON response but got ${contentType}. This usually means the API service is not deployed or there's an error. Response: ${textResponse.substring(
                0,
                100
              )}...`
            );
          }

          const result = await response.json();
          console.log("✅ Classification result:", result);
          console.log("🔍 Parsed fields:", {
            type: result.type,
            color: result.color,
            caption: result.caption?.substring(0, 50) + "...",
          });

          setClassificationResult(result);

          // Show results for 3 seconds, then close dialog
          console.log("⏰ Setting 3-second timeout to close dialog");
          setTimeout(() => {
            console.log("🔄 Closing dialog and resetting state");
            setIsAddDialogOpen(false);
            setSelectedImage(null);
            setClassificationResult(null);
          }, 3000);
        } catch (error) {
          console.error("❌ Classification API error:", error);
          console.log("🔍 Error details:", {
            message: error instanceof Error ? error.message : "Unknown error",
            stack: error instanceof Error ? error.stack : "No stack trace",
            type: typeof error,
          });
          alert(
            `Classification failed: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        } finally {
          console.log("🏁 Setting classifying state to false");
          setClassifying(false);
        }
      };

      reader.onerror = (error) => {
        console.error("❌ FileReader error:", error);
        alert("Failed to read the selected file");
        setClassifying(false);
      };

      console.log("🚀 Starting readAsDataURL...");
      reader.readAsDataURL(selectedImage);
    } catch (error) {
      console.error("❌ File processing error:", error);
      console.log("🔍 Outer catch error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : "No stack trace",
        type: typeof error,
      });
      alert("Failed to process the selected file");
      setClassifying(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-8 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-blue-950/20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <div className="relative">
                <Shirt className="size-16 text-purple-600 dark:text-purple-400" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-2 -right-2"
                >
                  <Sparkles className="size-6 text-pink-500" />
                </motion.div>
              </div>
            </motion.div>

            <h1
              className="text-7xl md:text-9xl tracking-tight mb-4"
              style={{
                fontFamily: "var(--font-heading)",
                WebkitTextStroke: "4px currentColor",
              }}
            >
              <span className="block">
                <span
                  className="text-black dark:text-white"
                  style={{ WebkitTextStroke: "4px currentColor" }}
                >
                  Your Digital{" "}
                </span>
                <span
                  className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
                  style={{
                    WebkitTextStroke: "4px transparent",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Wardrobe
                </span>
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Browse your collection, select items to create outfits, or let AI
              generate the perfect combination for you
            </p>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl md:text-4xl mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                My Wardrobe
              </h2>
              <p className="text-muted-foreground">
                Manage your collection and track your style
              </p>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Plus className="size-5" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Item with AI</DialogTitle>
                  <DialogDescription>
                    Upload an image and let our AI classify your clothing item
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  {/* Image Upload Section */}
                  <div className="space-y-4">
                    <Label>Upload Image</Label>
                    <div
                      className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-purple-500/50 transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragEnter={(e) => e.preventDefault()}
                    >
                      {selectedImage ? (
                        <div className="space-y-2">
                          <div className="w-32 h-32 mx-auto rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <img
                              src={URL.createObjectURL(selectedImage)}
                              alt="Selected item"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-sm text-muted-foreground truncate max-w-[200px] mx-auto">
                            {selectedImage.name}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              setSelectedImage(null);
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="size-8 mx-auto text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Only PNG, JPG, JPEG files up to 10MB
                          </p>
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpg,image/jpeg"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </div>

                  {/* Classification Results */}
                  {classificationResult && (
                    <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                        AI Classification Results
                      </h4>
                      <div className="text-sm text-green-700 dark:text-green-300 space-y-2">
                        <p>
                          <strong>Type:</strong>{" "}
                          {classificationResult.type || "Unknown"}
                        </p>
                        <p>
                          <strong>Color:</strong>{" "}
                          {classificationResult.color || "Unknown"}
                        </p>
                        <p>
                          <strong>Description:</strong>{" "}
                          {classificationResult.caption?.trim() ||
                            "No description available"}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddDialogOpen(false);
                        setSelectedImage(null);
                        setClassificationResult(null);
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={classifyImage}
                      disabled={!selectedImage || classifying}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      {classifying ? (
                        <>
                          <Loader2 className="size-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Camera className="size-4 mr-2" />
                          Classify Item
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-2 hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="size-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${stat.color}20` }}
                      >
                        <stat.icon
                          className="size-5"
                          style={{ color: stat.color }}
                        />
                      </div>
                      <div>
                        <p className="text-2xl">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="border-2">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSearchQuery(e.target.value)
                    }
                    placeholder="Search by name, brand, or tags..."
                    className="pl-10"
                  />
                </div>

                <div className="flex gap-2">
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-[180px]">
                      <Filter className="size-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex border rounded-lg overflow-hidden">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setViewMode("grid")}
                      className="rounded-none"
                    >
                      <Grid3x3 className="size-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setViewMode("list")}
                      className="rounded-none"
                    >
                      <List className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Items Grid/List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {viewMode === "grid" ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -8 }}
                  >
                    <Card className="overflow-hidden border-2 hover:border-purple-500/30 transition-all group">
                      <div className="relative aspect-square bg-muted overflow-hidden">
                        <ImageWithFallback
                          src={item.imageUrl}
                          alt={item.name}
                          className="size-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {item.favorite && (
                          <div className="absolute top-2 right-2 size-8 bg-white/90 dark:bg-black/90 rounded-full flex items-center justify-center">
                            <Heart className="size-4 fill-pink-500 text-pink-500" />
                          </div>
                        )}
                        <div
                          className="absolute bottom-0 left-0 right-0 h-1"
                          style={{ backgroundColor: item.color }}
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="mb-1">{item.name}</h3>
                        {item.brand && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {item.brand}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mb-3">
                          {item.tags.slice(0, 2).map((tag, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <TrendingUp className="size-3" />
                            Worn {item.timesWorn}x
                          </span>
                          {item.lastWorn && (
                            <span className="flex items-center gap-1">
                              <Calendar className="size-3" />
                              {Math.floor(
                                (Date.now() - item.lastWorn.getTime()) /
                                  (1000 * 60 * 60 * 24)
                              )}
                              d ago
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="border-2 hover:border-purple-500/30 transition-all">
                      <CardContent className="p-4">
                        <div className="flex gap-4 items-center">
                          <div className="size-24 bg-muted rounded-lg overflow-hidden shrink-0">
                            <ImageWithFallback
                              src={item.imageUrl}
                              alt={item.name}
                              className="size-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="mb-1">{item.name}</h3>
                                {item.brand && (
                                  <p className="text-sm text-muted-foreground">
                                    {item.brand}
                                  </p>
                                )}
                              </div>
                              {item.favorite && (
                                <Heart className="size-5 fill-pink-500 text-pink-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              {item.tags.map((tag, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <div
                                  className="size-3 rounded-full border"
                                  style={{ backgroundColor: item.color }}
                                />
                                {item.category}
                              </span>
                              <span className="flex items-center gap-1">
                                <TrendingUp className="size-3" />
                                Worn {item.timesWorn} times
                              </span>
                              {item.lastWorn && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="size-3" />
                                  Last worn{" "}
                                  {Math.floor(
                                    (Date.now() - item.lastWorn.getTime()) /
                                      (1000 * 60 * 60 * 24)
                                  )}{" "}
                                  days ago
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {filteredItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <ShoppingBag className="size-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl mb-2">No items found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filters
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
