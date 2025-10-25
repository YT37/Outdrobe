import {
  ExternalLink,
  Search,
  ShoppingCart,
  Sparkles,
  Store,
  Tag,
  TruckIcon,
  User,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { AvatarViewer } from "../components/AvatarViewer";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";

interface WardrobeItem {
  id: number;
  name: string;
  category: string;
  color: string;
  image: string;
}

interface ProductRecommendation {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  store: string;
  link: string;
  promoCode?: string;
  shipping: "Free Shipping" | "Paid Shipping" | "Pickup Available";
  pairingReason: string;
  rating: number;
}

export function MarketplacePage() {
  const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [avatarViewerOpen, setAvatarViewerOpen] = useState(false);
  const [tryOnItems, setTryOnItems] = useState<string[]>([]);

  // Mock wardrobe items
  const wardrobeItems: WardrobeItem[] = [
    {
      id: 1,
      name: "Black Leather Jacket",
      category: "Outerwear",
      color: "Black",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
    },
    {
      id: 2,
      name: "White Cotton T-Shirt",
      category: "Tops",
      color: "White",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    },
    {
      id: 3,
      name: "Blue Denim Jeans",
      category: "Bottoms",
      color: "Blue",
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
    },
    {
      id: 4,
      name: "Beige Trench Coat",
      category: "Outerwear",
      color: "Beige",
      image:
        "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400",
    },
    {
      id: 5,
      name: "Striped Button-Up Shirt",
      category: "Tops",
      color: "Multi",
      image:
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400",
    },
    {
      id: 6,
      name: "Gray Wool Sweater",
      category: "Tops",
      color: "Gray",
      image:
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400",
    },
  ];

  // Mock AI-generated recommendations
  const getRecommendations = (item: WardrobeItem): ProductRecommendation[] => {
    const recommendations: Record<string, ProductRecommendation[]> = {
      "Black Leather Jacket": [
        {
          id: 1,
          name: "Slim Fit Black Jeans",
          price: 39.99,
          originalPrice: 59.99,
          image:
            "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400",
          store: "ASOS",
          link: "#",
          promoCode: "STYLE20",
          shipping: "Free Shipping",
          pairingReason:
            "Classic black-on-black look. Perfect for edgy street style.",
          rating: 4.5,
        },
        {
          id: 2,
          name: "White Graphic Tee",
          price: 19.99,
          image:
            "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400",
          store: "H&M",
          link: "#",
          shipping: "Pickup Available",
          pairingReason:
            "Contrasts beautifully with black leather. Timeless combo.",
          rating: 4.2,
        },
        {
          id: 3,
          name: "Chelsea Boots",
          price: 89.99,
          originalPrice: 129.99,
          image:
            "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400",
          store: "Nordstrom",
          link: "#",
          promoCode: "BOOTS15",
          shipping: "Free Shipping",
          pairingReason:
            "Completes the rocker aesthetic. Essential for leather jackets.",
          rating: 4.8,
        },
      ],
      "White Cotton T-Shirt": [
        {
          id: 4,
          name: "High-Waisted Mom Jeans",
          price: 44.99,
          image:
            "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=400",
          store: "Urban Outfitters",
          link: "#",
          promoCode: "UO10OFF",
          shipping: "Free Shipping",
          pairingReason:
            "Creates a clean, minimalist look. Perfect casual outfit.",
          rating: 4.6,
        },
        {
          id: 5,
          name: "Denim Overshirt",
          price: 54.99,
          originalPrice: 74.99,
          image:
            "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400",
          store: "Zara",
          link: "#",
          shipping: "Pickup Available",
          pairingReason: "Layers well for a relaxed, effortless vibe.",
          rating: 4.3,
        },
      ],
      "Blue Denim Jeans": [
        {
          id: 6,
          name: "Striped Long-Sleeve Tee",
          price: 29.99,
          image:
            "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400",
          store: "Uniqlo",
          link: "#",
          shipping: "Free Shipping",
          pairingReason: "Adds visual interest while keeping it casual.",
          rating: 4.4,
        },
        {
          id: 7,
          name: "Camel Suede Jacket",
          price: 119.99,
          originalPrice: 179.99,
          image:
            "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400",
          store: "Mango",
          link: "#",
          promoCode: "FALL25",
          shipping: "Free Shipping",
          pairingReason: "Warm tones complement blue denim beautifully.",
          rating: 4.7,
        },
      ],
    };

    return (
      recommendations[item.name] || [
        {
          id: 8,
          name: "Basic White Sneakers",
          price: 49.99,
          image:
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
          store: "Nike",
          link: "#",
          shipping: "Free Shipping",
          pairingReason: "Versatile staple that pairs well with any outfit.",
          rating: 4.5,
        },
      ]
    );
  };

  const handleAnalyze = (item: WardrobeItem) => {
    setSelectedItem(item);
    setAnalyzing(true);
    // Add the base wardrobe item to try-on
    if (!tryOnItems.includes(item.name)) {
      setTryOnItems((prev) => [...prev, item.name]);
    }
    setTimeout(() => {
      setAnalyzing(false);
    }, 1500);
  };

  const toggleTryOn = (itemName: string) => {
    setTryOnItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    );
  };

  const recommendations = selectedItem ? getRecommendations(selectedItem) : [];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-background via-purple-50/20 to-background dark:via-purple-950/10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
            <ShoppingCart className="size-8 text-white" />
          </div>
          <h1
            className="text-5xl md:text-6xl mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <span className="text-black dark:text-white">Smart</span>
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {" "}
              Marketplace
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            AI-powered shopping assistant that analyzes your wardrobe and finds
            the perfect pairing items at the best prices
          </p>
        </motion.div>

        {/* Wardrobe Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="size-5 text-purple-600" />
                Select an Item from Your Wardrobe
              </CardTitle>
              <CardDescription>
                Choose any item to get AI-powered pairing suggestions with the
                best deals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {wardrobeItems.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      selectedItem?.id === item.id
                        ? "border-purple-600 shadow-lg shadow-purple-500/20"
                        : "border-transparent hover:border-purple-300"
                    }`}
                    onClick={() => handleAnalyze(item)}
                  >
                    <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-2 bg-card">
                      <p className="text-xs truncate">{item.name}</p>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {item.category}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Analysis Loading */}
        {analyzing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <div className="relative">
              <Zap className="size-16 text-purple-600 animate-pulse" />
              <motion.div
                className="absolute inset-0 bg-purple-600 rounded-full blur-xl opacity-50"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </div>
            <p className="mt-4 text-lg text-muted-foreground">
              AI analyzing pairing options...
            </p>
          </motion.div>
        )}

        {/* Recommendations */}
        {!analyzing && selectedItem && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2
                className="text-3xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Perfect Pairings for{" "}
                <span className="text-purple-600">{selectedItem.name}</span>
              </h2>
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                {recommendations.length} Items Found
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-shadow group">
                    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {product.promoCode && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-red-600 text-white gap-1">
                            <Tag className="size-3" />
                            Promo
                          </Badge>
                        </div>
                      )}
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-black/70 text-white">
                          ⭐ {product.rating}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id={`try-on-${product.id}`}
                          checked={tryOnItems.includes(product.name)}
                          onCheckedChange={() => toggleTryOn(product.name)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <label
                            htmlFor={`try-on-${product.id}`}
                            className="cursor-pointer"
                          >
                            <h3 className="text-lg mb-1">{product.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {product.pairingReason}
                            </p>
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Store className="size-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {product.store}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                        {product.originalPrice && (
                          <Badge variant="secondary" className="text-xs">
                            Save $
                            {(product.originalPrice - product.price).toFixed(2)}
                          </Badge>
                        )}
                      </div>

                      {product.promoCode && (
                        <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Tag className="size-4 text-red-600 dark:text-red-400" />
                            <span className="text-sm">
                              Promo Code Available
                            </span>
                          </div>
                          <code className="text-sm bg-white dark:bg-black px-2 py-1 rounded border">
                            {product.promoCode}
                          </code>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                        {product.shipping === "Free Shipping" && (
                          <>
                            <TruckIcon className="size-4 text-green-600" />
                            <span className="text-green-600 dark:text-green-400">
                              Free Shipping
                            </span>
                          </>
                        )}
                        {product.shipping === "Paid Shipping" && (
                          <>
                            <TruckIcon className="size-4" />
                            <span>Shipping Available</span>
                          </>
                        )}
                        {product.shipping === "Pickup Available" && (
                          <>
                            <Store className="size-4 text-blue-600" />
                            <span className="text-blue-600 dark:text-blue-400">
                              Pickup Available
                            </span>
                          </>
                        )}
                      </div>

                      <Button
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2"
                        onClick={() => window.open(product.link, "_blank")}
                      >
                        <ExternalLink className="size-4" />
                        View Deal
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!selectedItem && !analyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-20"
          >
            <Search className="size-20 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-2xl mb-2 text-muted-foreground">
              Select an item to get started
            </h3>
            <p className="text-muted-foreground">
              Our AI will analyze your selection and find the best pairing
              options with exclusive deals
            </p>
          </motion.div>
        )}
      </div>

      {/* Floating Try-On Button */}
      <AnimatePresence>
        {tryOnItems.length > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-8 right-8 z-40"
          >
            <Button
              size="lg"
              onClick={() => setAvatarViewerOpen(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-2xl hover:shadow-purple-500/50 transition-all gap-2 pr-6"
            >
              <div className="relative">
                <User className="size-6" />
                <Badge className="absolute -top-2 -right-2 size-5 flex items-center justify-center p-0 bg-red-600 text-white border-2 border-background">
                  {tryOnItems.length}
                </Badge>
              </div>
              <span className="text-lg">Try On Avatar</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar Viewer Modal */}
      <AvatarViewer
        isOpen={avatarViewerOpen}
        onClose={() => setAvatarViewerOpen(false)}
        selectedItems={tryOnItems}
      />
    </div>
  );
}
