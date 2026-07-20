import { motion } from "framer-motion";

export const ShinyText = ({
  text,
  className = "",
  gradientClass = "text-gradient",
}: {
  text: string;
  className?: string;
  gradientClass?: string;
}) => {
  return (
    <motion.span
      className={`inline-block ${gradientClass} ${className}`}
      initial={{ backgroundPosition: "200% center" }}
      animate={{ backgroundPosition: "-200% center" }}
      transition={{
        repeat: Infinity,
        duration: 3,
        ease: "linear",
      }}
      style={{
        backgroundSize: "200% auto",
      }}
    >
      {text}
    </motion.span>
  );
};
