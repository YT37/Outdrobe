import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, PerspectiveCamera, Text } from "@react-three/drei";
import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useState, Suspense } from "react";
import { Button } from "./ui/button";

interface WardrobeItemProps {
  position: [number, number, number];
  color: string;
  label: string;
  onClick: () => void;
  isSelected: boolean;
}

function WardrobeItem({ position, color, label, onClick, isSelected }: WardrobeItemProps) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group position={position} onClick={onClick}>
        <mesh scale={isSelected ? 1.2 : 1}>
          <boxGeometry args={[1, 1.5, 0.2]} />
          <meshStandardMaterial 
            color={color} 
            emissive={isSelected ? color : "#000000"}
            emissiveIntensity={isSelected ? 0.3 : 0}
          />
        </mesh>
        <Text
          position={[0, -1, 0.2]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      </group>
    </Float>
  );
}

interface WardrobeSceneProps {
  selectedItems: string[];
  onItemClick: (id: string) => void;
}

function WardrobeScene({ selectedItems, onItemClick }: WardrobeSceneProps) {
  const items = [
    { position: [-3, 1, 0] as [number, number, number], color: "#FF6B9D", label: "Shirt", id: "shirt" },
    { position: [-1, 1, 0] as [number, number, number], color: "#4ECDC4", label: "Pants", id: "pants" },
    { position: [1, 1, 0] as [number, number, number], color: "#FFE66D", label: "Dress", id: "dress" },
    { position: [3, 1, 0] as [number, number, number], color: "#95E1D3", label: "Jacket", id: "jacket" },
    { position: [-2, -1, 0] as [number, number, number], color: "#A8E6CF", label: "Skirt", id: "skirt" },
    { position: [0, -1, 0] as [number, number, number], color: "#F38181", label: "Shoes", id: "shoes" },
    { position: [2, -1, 0] as [number, number, number], color: "#AA96DA", label: "Bag", id: "bag" },
  ];

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      {items.map((item) => (
        <WardrobeItem
          key={item.id}
          position={item.position}
          color={item.color}
          label={item.label}
          onClick={() => onItemClick(item.id)}
          isSelected={selectedItems.includes(item.id)}
        />
      ))}
      
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
    </>
  );
}

export function InteractiveWardrobe() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [hasRendered, setHasRendered] = useState(false);

  const handleItemClick = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleGenerateOutfit = () => {
    const items = ["shirt", "pants", "shoes"];
    setSelectedItems(items);
  };

  // Only render Canvas once when in view
  if (isInView && !hasRendered) {
    setHasRendered(true);
  }

  return (
    <div id="wardrobe" ref={ref} className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl mb-4">Your Digital Wardrobe</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Interact with your clothing in 3D. Click items to select them or let AI create the perfect combination.
          </p>
          <Button onClick={handleGenerateOutfit} size="lg">
            Generate AI Outfit
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="h-[500px] rounded-xl overflow-hidden bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-border"
        >
          {hasRendered && (
            <Canvas gl={{ antialias: true, alpha: true }}>
              <Suspense fallback={null}>
                <WardrobeScene selectedItems={selectedItems} onItemClick={handleItemClick} />
              </Suspense>
            </Canvas>
          )}
        </motion.div>

        {selectedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-center"
          >
            <p className="text-lg">
              Selected: <span className="text-primary">{selectedItems.join(", ")}</span>
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
