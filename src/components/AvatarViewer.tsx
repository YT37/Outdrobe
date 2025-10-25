import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  Badge,
  Button,
  motion,
  Palette,
  Suspense,
  User,
  useState,
  X,
} from "../utils/shared-imports";

interface AvatarViewerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItems: string[];
}

// Skin tone options
const SKIN_TONES = [
  { name: "Light", color: "#FFDFC4" },
  { name: "Medium", color: "#D4A574" },
  { name: "Tan", color: "#AB7D5C" },
  { name: "Deep", color: "#7B5444" },
];

// Simple 3D Avatar component
function Avatar({
  skinTone,
  clothingColor,
}: {
  skinTone: string;
  clothingColor: string;
}) {
  return (
    <group>
      {/* Head */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color={skinTone} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 0.25, 16]} />
        <meshStandardMaterial color={skinTone} />
      </mesh>

      {/* Torso - Upper Body (Shirt) */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.25, 0.35, 0.9, 16]} />
        <meshStandardMaterial color={clothingColor} />
      </mesh>

      {/* Left Arm */}
      <group position={[-0.4, 0.8, 0]}>
        <mesh position={[0, -0.2, 0]} rotation={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} />
          <meshStandardMaterial color={clothingColor} />
        </mesh>
        {/* Hand */}
        <mesh position={[0.1, -0.6, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={skinTone} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group position={[0.4, 0.8, 0]}>
        <mesh position={[0, -0.2, 0]} rotation={[0, 0, -0.3]}>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} />
          <meshStandardMaterial color={clothingColor} />
        </mesh>
        {/* Hand */}
        <mesh position={[-0.1, -0.6, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={skinTone} />
        </mesh>
      </group>

      {/* Left Leg (Pants) */}
      <group position={[-0.15, -0.2, 0]}>
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.12, 0.1, 0.8, 16]} />
          <meshStandardMaterial color="#2C5F8D" />
        </mesh>
        {/* Foot */}
        <mesh position={[0, -0.85, 0.08]}>
          <boxGeometry args={[0.15, 0.08, 0.25]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>

      {/* Right Leg (Pants) */}
      <group position={[0.15, -0.2, 0]}>
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.12, 0.1, 0.8, 16]} />
          <meshStandardMaterial color="#2C5F8D" />
        </mesh>
        {/* Foot */}
        <mesh position={[0, -0.85, 0.08]}>
          <boxGeometry args={[0.15, 0.08, 0.25]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>
    </group>
  );
}

// 3D Scene component
function AvatarScene({
  skinTone,
  autoRotate,
}: {
  skinTone: string;
  autoRotate: boolean;
}) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1, 3]} />

      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-5, 3, -5]} intensity={0.4} />
      <pointLight position={[0, 2, 0]} intensity={0.3} />

      {/* Avatar */}
      <Avatar skinTone={skinTone} clothingColor="#4A90E2" />

      {/* Ground plane */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.3, 0]}
        receiveShadow
      >
        <circleGeometry args={[2, 32]} />
        <meshStandardMaterial color="#e0e0e0" opacity={0.5} transparent />
      </mesh>

      {/* Controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={2}
        maxDistance={5}
        maxPolarAngle={Math.PI / 2}
        autoRotate={autoRotate}
        autoRotateSpeed={2}
      />
    </>
  );
}

export function AvatarViewer({
  isOpen,
  onClose,
  selectedItems,
}: AvatarViewerProps) {
  const [skinTone, setSkinTone] = useState(SKIN_TONES[0].color);
  const [autoRotate, setAutoRotate] = useState(true);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-background rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
              <User className="size-6 text-white" />
            </div>
            <div>
              <h2
                className="text-2xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Try On Avatar
              </h2>
              <p className="text-sm text-muted-foreground">
                Visualize your outfit in 3D
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-[1fr_300px] gap-6 p-6">
          {/* 3D Viewer */}
          <div className="relative aspect-square md:aspect-auto md:h-[500px] bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl overflow-hidden border border-border">
            <Canvas shadows>
              <Suspense fallback={null}>
                <AvatarScene skinTone={skinTone} autoRotate={autoRotate} />
              </Suspense>
            </Canvas>

            {/* Rotation Toggle */}
            <div className="absolute bottom-4 right-4">
              <Button
                size="sm"
                variant={autoRotate ? "default" : "secondary"}
                onClick={() => setAutoRotate(!autoRotate)}
                className={
                  autoRotate
                    ? "bg-gradient-to-r from-purple-600 to-pink-600"
                    : ""
                }
              >
                {autoRotate ? "⏸ Stop Spin" : "▶ Auto Spin"}
              </Button>
            </div>

            {/* Hint */}
            <div className="absolute top-4 left-4">
              <Badge className="bg-black/70 text-white">
                Drag to rotate • Scroll to zoom
              </Badge>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            {/* Skin Tone Selector */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Palette className="size-5 text-purple-600" />
                <h3 className="text-lg">Skin Tone</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {SKIN_TONES.map((tone) => (
                  <button
                    key={tone.name}
                    onClick={() => setSkinTone(tone.color)}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                      skinTone === tone.color
                        ? "border-purple-600 bg-purple-50 dark:bg-purple-950/20"
                        : "border-border hover:border-purple-300"
                    }`}
                  >
                    <div
                      className="size-8 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: tone.color }}
                    />
                    <span className="text-sm">{tone.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Items */}
            <div>
              <h3 className="text-lg mb-3">Wearing</h3>
              <div className="space-y-2">
                {selectedItems.length > 0 ? (
                  selectedItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-muted rounded-lg"
                    >
                      <div className="size-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                    No items selected yet
                  </p>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Pro Tip:</strong> This 3D preview helps you visualize
                how different items look together before making a purchase!
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
