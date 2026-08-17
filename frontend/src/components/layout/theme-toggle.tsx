'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative h-9 w-9 rounded-full bg-transparent hover:bg-accent flex items-center justify-center transition-colors">
        <motion.div
          initial={false}
          animate={{ rotate: 0, scale: 1 }}
          className="absolute inset-0 flex items-center justify-center dark:rotate-90 dark:scale-0 transition-all duration-300"
        >
          <Sun className="h-5 w-5 text-foreground/80 hover:text-foreground" />
        </motion.div>
        <motion.div
          initial={false}
          animate={{ rotate: 0, scale: 1 }}
          className="absolute inset-0 flex items-center justify-center rotate-90 scale-0 dark:rotate-0 dark:scale-100 transition-all duration-300"
        >
          <Moon className="h-5 w-5 text-foreground/80 hover:text-foreground" />
        </motion.div>
        <span className="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-xl border-border/50 bg-background/95 backdrop-blur-sm shadow-md mt-2">
        <DropdownMenuItem onClick={() => setTheme('light')} className="cursor-pointer font-medium">
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer font-medium">
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')} className="cursor-pointer font-medium">
          <span className="mr-2 h-4 w-4 flex items-center justify-center font-bold">⌘</span>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
