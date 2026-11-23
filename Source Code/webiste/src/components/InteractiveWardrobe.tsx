import { CheckCircle2, ShoppingBag, Sparkles } from "lucide-react";
import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { ImageWithFallback } from "./common/ImageWithFallback";
import { Button } from "./ui/button";

interface ClothingItem {
  id: string;
  name: string;
  category: "tops" | "bottoms";
  color: string;
  imageUrl: string;
  price: string;
}

const wardrobeItems: ClothingItem[] = [
  {
    id: "white-tee",
    name: "Classic White Tee",
    category: "tops",
    color: "White",
    imageUrl:
      "https://images.unsplash.com/photo-1688111421202-bda886f5e215?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHQtc2hpcnQlMjBmYXNoaW9ufGVufDF8fHx8MTc2MTQwMDg5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: "$29",
  },
  {
    id: "black-tee",
    name: "Black Tee",
    category: "tops",
    color: "Black",
    imageUrl:
      "https://images.unsplash.com/photo-1759572095317-3a96f9a98e2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHQtc2hpcnQlMjBjbG90aGluZ3xlbnwxfHx8fDE3NjE0NDkyMjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: "$29",
  },
  {
    id: "striped-shirt",
    name: "Striped Shirt",
    category: "tops",
    color: "Striped",
    imageUrl:
      "https://images.unsplash.com/photo-1490092218187-0713ea317e21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJpcGVkJTIwc2hpcnQlMjBmYXNoaW9ufGVufDF8fHx8MTc2MTQ0OTIyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: "$45",
  },
  {
    id: "casual-shirt",
    name: "Casual Shirt",
    category: "tops",
    color: "Blue",
    imageUrl:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXN1YWwlMjBzaGlydCUyMGNsb3RoaW5nfGVufDF8fHx8MTc2MTQ0MDgwNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: "$42",
  },
  {
    id: "polo-shirt",
    name: "Polo Shirt",
    category: "tops",
    color: "Navy",
    imageUrl:
      "https://images.unsplash.com/photo-1586363129094-d7a38564fae1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2xvJTIwc2hpcnQlMjBjYXN1YWx8ZW58MXx8fHwxNzYxNDQ5MjMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: "$38",
  },
  {
    id: "blue-jeans",
    name: "Blue Jeans",
    category: "bottoms",
    color: "Denim Blue",
    imageUrl:
      "https://images.unsplash.com/photo-1713880442898-0f151fba5e16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwamVhbnMlMjBkZW5pbXxlbnwxfHx8fDE3NjEzOTk2NTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: "$65",
  },
  {
    id: "black-pants",
    name: "Black Pants",
    category: "bottoms",
    color: "Black",
    imageUrl:
      "https://images.unsplash.com/photo-1666792494266-16d83aaf1105?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHBhbnRzJTIwdHJvdXNlcnN8ZW58MXx8fHwxNzYxNDQ5MjI4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: "$55",
  },
  {
    id: "khaki-chinos",
    name: "Khaki Chinos",
    category: "bottoms",
    color: "Khaki",
    imageUrl:
      "https://images.unsplash.com/photo-1698919585873-8c6852de9b96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraGFraSUyMHBhbnRzJTIwY2hpbm9zfGVufDF8fHx8MTc2MTQ0OTIyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    price: "$58",
  },
];

interface WardrobeCardProps {
  item: ClothingItem;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

function WardrobeCard({
  item,
  isSelected,
  onSelect,
  index,
}: WardrobeCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -12, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onSelect}
      className="cursor-pointer group relative"
    >
      <div
        className={`
        relative overflow-hidden rounded-2xl border-2 transition-all duration-300
        ${
          isSelected
            ? "border-purple-500 shadow-2xl shadow-purple-500/30 ring-4 ring-purple-500/20"
            : "border-border hover:border-purple-300 dark:hover:border-purple-700 shadow-lg hover:shadow-2xl"
        }
        bg-card
      `}
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <motion.div
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.4 }}
            className="size-full"
          >
            <ImageWithFallback
              src={item.imageUrl}
              alt={item.name}
              className="size-full object-cover"
            />
          </motion.div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Selection Indicator */}
          {isSelected && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute top-4 right-4 bg-purple-600 rounded-full p-2 shadow-xl"
            >
              <CheckCircle2 className="size-6 text-white" />
            </motion.div>
          )}

          {/* Hover Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs"
          >
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {item.category === "tops" ? "Top" : "Bottom"}
            </span>
          </motion.div>
        </div>

        {/* Info Section */}
        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {item.name}
              </h3>
              <p className="text-sm text-muted-foreground">{item.color}</p>
            </div>
            <span className="text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {item.price}
            </span>
          </div>

          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              w-full py-2 rounded-lg text-sm transition-all
              ${
                isSelected
                  ? "bg-purple-600 text-white"
                  : "bg-muted text-foreground hover:bg-purple-50 dark:hover:bg-purple-950/30"
              }
            `}
          >
            {isSelected ? "Selected ✓" : "Select Item"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export function InteractiveWardrobe() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | "tops" | "bottoms">(
    "all"
  );

  const handleItemSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleGenerateOutfit = () => {
    // AI generates a random outfit
    const tops = wardrobeItems.filter((item) => item.category === "tops");
    const bottoms = wardrobeItems.filter((item) => item.category === "bottoms");

    const randomTop = tops[Math.floor(Math.random() * tops.length)];
    const randomBottom = bottoms[Math.floor(Math.random() * bottoms.length)];

    setSelectedItems([randomTop.id, randomBottom.id]);
  };

  const filteredItems = wardrobeItems.filter((item) => {
    if (activeFilter === "all") return true;
    return item.category === activeFilter;
  });

  const selectedCount = selectedItems.length;
  const hasTop = selectedItems.some(
    (id) => wardrobeItems.find((item) => item.id === id)?.category === "tops"
  );
  const hasBottom = selectedItems.some(
    (id) => wardrobeItems.find((item) => item.id === id)?.category === "bottoms"
  );

  return (
    <div
      id="wardrobe"
      ref={ref}
      className="py-20 bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-0 right-0 size-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-0 left-0 size-96 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Filter & Generate Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-4 justify-center items-center mb-12"
        >
          {/* Filter Tabs */}
          <div className="flex gap-2 bg-muted p-1.5 rounded-xl">
            {(["all", "tops", "bottoms"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`
                  px-6 py-2 rounded-lg text-sm transition-all capitalize
                  ${
                    activeFilter === filter
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                      : "text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerateOutfit}
            size="lg"
            className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30"
          >
            <Sparkles className="size-4" />
            Generate AI Outfit
          </Button>
        </motion.div>

        {/* Selected Items Summary */}
        {selectedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto mb-8 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border-2 border-purple-500/20 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <ShoppingBag className="size-6 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Selected Items
                  </p>
                  <p className="text-lg">
                    {selectedCount} item{selectedCount !== 1 ? "s" : ""}
                    {hasTop && hasBottom && (
                      <span className="ml-2 text-sm text-green-600 dark:text-green-400">
                        ✓ Complete outfit
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setSelectedItems([])}
                className="border-2 hover:border-purple-500/50"
              >
                Clear Selection
              </Button>
            </div>
          </motion.div>
        )}

        {/* Wardrobe Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {filteredItems.map((item, index) => (
            <WardrobeCard
              key={item.id}
              item={item}
              isSelected={selectedItems.includes(item.id)}
              onSelect={() => handleItemSelect(item.id)}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
