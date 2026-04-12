"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Blocks,
  ChevronsUpDown,
  Plus,
  Settings,
  UserCog,
  LogOut,
  UserCircle,
  Sun,
  Moon,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useLocation } from "react-router-dom"; // changed from next/link and next/navigation
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/contexts/SidebarContext";

const sidebarVariants = {
  open: { width: "15rem" },
  closed: { width: "4rem" }, // Adjusted slightly for visual balance
};

const contentVariants = {
  open: { display: "block", opacity: 1 },
  closed: { display: "block", opacity: 1 },
};

const variants = {
  open: {
    x: 0,
    opacity: 1,
    transition: { x: { stiffness: 1000, velocity: -100 } },
  },
  closed: {
    x: -20,
    opacity: 0,
    transition: { x: { stiffness: 100 } },
  },
};

const transitionProps = {
  type: "tween",
  ease: "easeOut",
  duration: 0.2,
  staggerChildren: 0.1,
};

const staggerVariants = {
  open: {
    transition: { staggerChildren: 0.03, delayChildren: 0.02 },
  },
};

export function SessionNavBar({ organization, userContext, navItems, onLogout }) {
  const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar();
  const location = useLocation();
  const pathname = location.pathname;

  const [isDark, setIsDark] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleMenu = (label) => {
    setExpandedMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  useEffect(() => {
      const theme = localStorage.getItem('theme') || 'dark';
      if (theme === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light-mode');
          setIsDark(true);
      } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light-mode');
          setIsDark(false);
      }
  }, []);

  const toggleTheme = () => {
      if (isDark) {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light-mode');
          localStorage.setItem('theme', 'light');
          setIsDark(false);
      } else {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light-mode');
          localStorage.setItem('theme', 'dark');
          setIsDark(true);
      }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden" 
          onClick={() => setIsMobileOpen(false)} 
        />
      )}

      <motion.div
        className={cn(
          "sidebar fixed md:relative z-50 h-full shrink-0 border-r bg-[var(--card-bg)] text-[var(--text-primary)] transition-transform duration-300 md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
        initial={isCollapsed ? "closed" : "open"}
        animate={isCollapsed ? "closed" : "open"}
        variants={sidebarVariants}
        transition={transitionProps}
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
      >
        <motion.div
          className={`relative z-50 flex h-full shrink-0 flex-col transition-all overflow-hidden`}
          variants={contentVariants}
        >
          <motion.ul variants={staggerVariants} className="flex h-full flex-col">
            <div className="flex grow flex-col">
              
              {/* Organization Header */}
              <div className="flex h-[60px] w-full shrink-0 border-b border-[var(--border-color)] p-2">
                <div className="flex w-full items-center justify-center">
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger className="w-full" asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn("flex items-center hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]", isCollapsed ? "justify-center px-0 w-10 h-10" : "px-2 w-full justify-start gap-3")} 
                      >
                        <Avatar className="rounded size-6 shrink-0">
                          {organization?.logo ? (
                            <AvatarImage src={organization.logo} />
                          ) : (
                            <AvatarFallback className="bg-blue-600 text-white text-xs">
                              {organization?.name?.[0] || "O"}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <motion.li variants={variants} className="flex flex-1 items-center justify-between overflow-hidden">
                          {!isCollapsed && (
                            <>
                              <p className="text-sm font-semibold truncate">
                                {organization?.name || "Organization"}
                              </p>
                              <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                            </>
                          )}
                        </motion.li>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 bg-[var(--card-bg)] border-[var(--border-color)]">
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link to="/setup" className="flex items-center gap-2">
                          <Settings className="h-4 w-4" /> Global Settings
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="flex grow w-full flex-col mt-2">
                <ScrollArea className="h-10 grow px-2">
                  <div className={cn("flex w-full flex-col gap-1")}>
                    {navItems.map((item, idx) => {
                      if (item.separator) {
                        return <Separator key={idx} className="my-2 border-[var(--border-color)]" />;
                      }

                      const isActive = pathname.startsWith(item.href) && item.href !== '#';
                      const isExpanded = expandedMenus[item.label];

                      if (item.subItems) {
                        return (
                          <div key={item.label} className="flex flex-col gap-1 w-full relative">
                            <button
                              onClick={() => {
                                if (isCollapsed) setIsCollapsed(false);
                                toggleMenu(item.label);
                              }}
                              className={cn(
                                "flex h-10 w-full flex-row items-center rounded-md transition-colors text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-blue-500",
                                isCollapsed ? "justify-center" : "px-3 justify-start"
                              )}
                            >
                              <span className="shrink-0">{item.icon}</span>
                              <motion.li variants={variants} className="overflow-hidden flex-1">
                                {!isCollapsed && (
                                  <div className="ml-3 flex items-center justify-between">
                                    <p className="text-sm truncate">{item.label}</p>
                                    {isExpanded ? <ChevronDown className="w-4 h-4 ml-2" /> : <ChevronRight className="w-4 h-4 ml-2" />}
                                  </div>
                                )}
                              </motion.li>
                            </button>
                            {!isCollapsed && isExpanded && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                className="flex flex-col ml-9 pr-2 space-y-1 mb-1 overflow-hidden"
                              >
                                {item.subItems.map(subItem => {
                                  const isSubActive = pathname === subItem.href || pathname.startsWith(subItem.href + '/');
                                  return (
                                    <Link
                                      key={subItem.href}
                                      to={subItem.href}
                                      onClick={() => setIsMobileOpen(false)}
                                      className={cn(
                                        "block px-3 py-2 border-l border-[var(--border-color)] text-[13px] font-medium transition-all rounded-r-md",
                                        isSubActive 
                                          ? "border-blue-500 text-blue-600 bg-blue-500/10" 
                                          : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:border-blue-400"
                                      )}
                                    >
                                      {subItem.label}
                                    </Link>
                                  );
                                })}
                              </motion.div>
                            )}
                          </div>
                        );
                      }

                      return (
                        <Link
                          key={item.href}
                          to={item.disabled ? "#" : item.href}
                          onClick={(e) => {
                              if (item.disabled) {
                                  e.preventDefault();
                                  alert('This feature is temporarily disabled for your role.');
                                  return;
                              }
                              setIsMobileOpen(false);
                          }}
                          className={cn(
                            "flex h-10 w-full flex-row items-center rounded-md transition-colors",
                            isCollapsed ? "justify-center" : "px-3 justify-start",
                            item.disabled ? "opacity-50 cursor-not-allowed text-[var(--text-secondary)]" : 
                                (isActive 
                                  ? "bg-blue-600/10 text-blue-600 font-semibold" 
                                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-blue-500")
                          )}
                        >
                          <span className="shrink-0">{item.icon}</span>
                          <motion.li variants={variants} className="overflow-hidden flex-1">
                            {!isCollapsed && (
                              <div className="ml-3 flex items-center justify-between">
                                <p className="text-sm truncate">{item.label}</p>
                                {item.badge && (
                                  <Badge
                                    className="ml-2 flex h-fit items-center rounded border-none bg-blue-100 px-1.5 py-0 text-[10px] text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                    variant="outline"
                                  >
                                    {item.badge}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </motion.li>
                        </Link>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>

              {/* Theme Toggle Footer Area */}
              <div className="flex flex-col p-2 border-t border-[var(--border-color)] text-[var(--text-primary)]">
                  <Button
                      variant="ghost"
                      onClick={toggleTheme}
                      className={cn(
                          "flex h-10 w-full flex-row items-center gap-2 rounded-md transition-colors hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]",
                          isCollapsed ? "justify-center px-0" : "px-3 justify-start"
                      )}
                      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                  >
                      <span className="shrink-0">
                          {isDark ? (
                              <Moon className="w-5 h-5 text-indigo-400 transition-transform" />
                          ) : (
                              <Sun className="w-5 h-5 text-amber-500 transition-transform" />
                          )}
                      </span>
                      <motion.li variants={variants} className="overflow-hidden flex-1">
                          {!isCollapsed && (
                              <div className="ml-2 flex items-center justify-between">
                                  <p className="text-sm font-medium truncate">
                                      {isDark ? 'Dark Mode' : 'Light Mode'}
                                  </p>
                              </div>
                          )}
                      </motion.li>
                  </Button>
              </div>


            </div>
          </motion.ul>
        </motion.div>
      </motion.div>
    </>
  );
}
