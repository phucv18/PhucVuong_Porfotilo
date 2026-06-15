import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Save, Edit3, Briefcase, Film, Heart, AlignLeft, 
  Settings, Layers, Phone, Mail, Plus, Trash2, ArrowUp, 
  ArrowDown, Link, Sparkles, Check, CheckCircle, Eye, AlertCircle,
  Play, Clipboard, HelpCircle, Calendar
} from "lucide-react";
import { ContentData, ProjectItem, MilestoneItem, SoftwareSkill, FormatSkill, CoreStrength, AboutCard } from "../types";

// Local helper of Google Drive parsing
const localIsGoogleDriveUrl = (url: string | null): boolean => {
  return url ? url.includes("drive.google.com") : false;
};

const localGetGoogleDriveEmbedUrl = (url: string | null): string => {
  if (!url) return "";
  if (url.includes("/preview")) return url;
  
  // Try to find the file ID
  const matches = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matches && matches[1]) {
    return `https://drive.google.com/file/d/${matches[1]}/preview`;
  }
  return url;
};

const localGetGoogleDriveImageUrl = (url: string | null): string => {
  if (!url) return "";
  if (!url.includes("drive.google.com")) return url;
  
  const matches = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matches && matches[1]) {
    return `https://lh3.googleusercontent.com/d/${matches[1]}=w800`;
  }
  return url;
};

const THUMBNAIL_PRESETS = [
  { name: "Tone Màu Cinema", url: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800" },
  { name: "Thời Gian Edit", url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800" },
  { name: "Ánh Sáng Neon", url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=800" },
  { name: "Rạp Phim Retro", url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800" },
  { name: "Ống Kính Máy Quay", url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800" },
  { name: "Bàn Màu DaVinci", url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800" }
];

interface AdminPanelProps {
  data: ContentData;
  onSave: (updatedData: ContentData) => Promise<boolean>;
}

type AdminTab = "hero" | "about" | "projects" | "experience" | "skills" | "contact";

export default function AdminPanel({ data, onSave }: AdminPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("hero");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  // Hidden/Invisible mode toggle with local storage persistence and URL override
  const [isButtonVisible, setIsButtonVisible] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("show_admin_button");
      if (saved === "true") return true;
      
      const params = new URLSearchParams(window.location.search);
      if (params.has("admin") || params.has("cms")) {
        localStorage.setItem("show_admin_button", "true");
        return true;
      }
    }
    return false; // Hidden by default for everyone else!
  });

  // Cloned states for editing
  const [formData, setFormData] = useState<ContentData>(() => JSON.parse(JSON.stringify(data)));
  const [newRoleInput, setNewRoleInput] = useState("");
  const [showRoleInput, setShowRoleInput] = useState(false);
  const [testingVideoIndex, setTestingVideoIndex] = useState<number | null>(null);

  // Set up event listeners for secret reveals
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret global shortcut: Alt + A or Ctrl + Shift + A
      const isAltA = e.altKey && e.key.toLowerCase() === "a";
      const isCtrlShiftA = e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a";
      
      if (isAltA || isCtrlShiftA) {
        e.preventDefault();
        setIsButtonVisible((prev) => {
          const nextState = !prev;
          localStorage.setItem("show_admin_button", String(nextState));
          return nextState;
        });
      }
    };

    // Secret double-click listener on footer copyright text
    const handleDoubleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.innerText && target.innerText.includes("PHÚC VƯƠNG")) {
        setIsButtonVisible((prev) => {
          const nextState = !prev;
          localStorage.setItem("show_admin_button", String(nextState));
          return nextState;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("dblclick", handleDoubleClick);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("dblclick", handleDoubleClick);
    };
  }, []);

  // Force reset form data when original data changes (e.g. initial load)
  React.useEffect(() => {
    setFormData(JSON.parse(JSON.stringify(data)));
  }, [data]);

  // Handle simple input changes
  const updateNestedField = (section: string, field: string, value: any) => {
    setFormData((prev: any) => {
      const cloned = { ...prev };
      if (!cloned[section]) cloned[section] = {};
      cloned[section][field] = value;
      return cloned;
    });
  };

  const updateSystemField = (field: string, value: any) => {
    setFormData((prev: any) => {
      const cloned = { ...prev };
      cloned.system = { ...cloned.system, [field]: value };
      return cloned;
    });
  };

  const updateArrayField = (section: string, index: number, field: string, value: any) => {
    setFormData((prev: any) => {
      const cloned = JSON.parse(JSON.stringify(prev));
      cloned[section][index][field] = value;
      return cloned;
    });
  };

  // Helper for adding/removing roles (for Hero)
  const handleAddRole = () => {
    const newRole = window.prompt("Nhập tên vai trò mới (Ví dụ: VFX Artist):");
    if (newRole && newRole.trim()) {
      setFormData((prev) => {
        const cloned = { ...prev };
        cloned.hero.roles = [...cloned.hero.roles, newRole.trim()];
        return cloned;
      });
    }
  };

  const handleRemoveRole = (indexName: number) => {
    setFormData((prev) => {
      const cloned = { ...prev };
      cloned.hero.roles = cloned.hero.roles.filter((_, idx) => idx !== indexName);
      return cloned;
    });
  };

  // Helper for projects
  const handleAddProject = () => {
    const newProj: ProjectItem = {
      number: String(formData.projects.list.length + 1).padStart(2, "0"),
      category: "Cinematic Editing",
      name: "Tên dự án mới",
      ctaLabel: "Xem Dự Án",
      videoUrl: "https://drive.google.com/file/d/MÃ_TỆP_GOOGLE_DRIVE/view?usp=sharing",
      thumbUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800",
      desc: "Mô tả ngắn gọn về sản phẩm và phương pháp dựng phim."
    };
    setFormData((prev) => {
      const cloned = JSON.parse(JSON.stringify(prev));
      cloned.projects.list.push(newProj);
      // Re-number
      cloned.projects.list.forEach((p: any, idx: number) => {
        p.number = String(idx + 1).padStart(2, "0");
      });
      return cloned;
    });
  };

  const handleDeleteProject = (index: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa dự án này?")) {
      setFormData((prev) => {
        const cloned = JSON.parse(JSON.stringify(prev));
        cloned.projects.list.splice(index, 1);
        // Re-number
        cloned.projects.list.forEach((p: any, idx: number) => {
          p.number = String(idx + 1).padStart(2, "0");
        });
        return cloned;
      });
    }
  };

  const handleMoveProject = (index: number, direction: "up" | "down") => {
    setFormData((prev) => {
      const cloned = JSON.parse(JSON.stringify(prev));
      const list = cloned.projects.list;
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      
      if (targetIndex >= 0 && targetIndex < list.length) {
        const temp = list[index];
        list[index] = list[targetIndex];
        list[targetIndex] = temp;
        // Re-number
        list.forEach((p: any, idx: number) => {
          p.number = String(idx + 1).padStart(2, "0");
        });
      }
      return cloned;
    });
  };

  // Helper for milestones
  const handleAddMilestone = () => {
    const newMile: MilestoneItem = {
      time: "2026",
      role: "Video Editor",
      employer: "Tên doanh nghiệp",
      details: "Chi tiết công việc và thành tựu đạt được tại vị trí này."
    };
    setFormData((prev) => {
      const cloned = JSON.parse(JSON.stringify(prev));
      cloned.experience.milestones.unshift(newMile); // Add to top
      return cloned;
    });
  };

  const handleDeleteMilestone = (index: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa mốc kinh nghiệm này?")) {
      setFormData((prev) => {
        const cloned = JSON.parse(JSON.stringify(prev));
        cloned.experience.milestones.splice(index, 1);
        return cloned;
      });
    }
  };

  const handleMoveMilestone = (index: number, direction: "up" | "down") => {
    setFormData((prev) => {
      const cloned = JSON.parse(JSON.stringify(prev));
      const list = cloned.experience.milestones;
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      
      if (targetIndex >= 0 && targetIndex < list.length) {
        const temp = list[index];
        list[index] = list[targetIndex];
        list[targetIndex] = temp;
      }
      return cloned;
    });
  };

  // Submit back to Express backend API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus("idle");
    
    try {
      const success = await onSave(formData);
      if (success) {
        setSaveStatus("success");
        setStatusMessage("Đã lưu và triển khai tất cả nội dung thành công!");
        setTimeout(() => setSaveStatus("idle"), 4000);
      } else {
        setSaveStatus("error");
        setStatusMessage("Có lỗi xảy ra trong quá trình lưu dữ liệu.");
      }
    } catch (err: any) {
      setSaveStatus("error");
      setStatusMessage(err.message || "Không thể kết nối đến máy chủ.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* Dynamic Floating Wrench Trigger Button - Rendered conditionally for stealth/admin security */}
      {isButtonVisible && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 cursor-pointer bg-amber-500 hover:bg-amber-400 text-stone-950 font-sans font-bold text-xs sm:text-sm px-4 py-3 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] border border-amber-300/30 transition-all duration-300 uppercase tracking-widest relative animate-fade-in"
            id="open-admin-panel"
          >
            <Settings className="w-4 h-4 animate-spin-slow animate-pulse" />
            <span>BẢNG QUẢN TRỊ CMS</span>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
            </span>
          </button>
        </div>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-hidden bg-stone-950/95 backdrop-blur-xl flex justify-end"
          >
            {/* Sidebar Control Panel Container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-4xl h-full bg-stone-900 border-l border-white/15 flex flex-col shadow-[-10px_0_40px_rgba(0,0,0,0.8)] relative"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                    <h2 className="text-xl font-bold tracking-tight text-white font-sans uppercase">
                      Quản lý Portfolio Real-Time
                    </h2>
                  </div>
                  <p className="text-[11px] font-mono text-stone-400 uppercase tracking-wider mt-1">
                    Chỉnh sửa bất kỳ trường nào để cập nhật giao diện ngay lập tức
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Stealth/Invisible toggler */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsButtonVisible(false);
                      localStorage.setItem("show_admin_button", "false");
                      setIsOpen(false);
                      alert("🔒 Đã kích hoạt Chế độ Ẩn Danh!\n\nNút 'BẢNG QUẢN TRỊ CMS' đã được ẩn hoàn toàn trên trình duyệt này.\n- Để hiển thị lại: Nhấn phím Alt + A (hoặc Option + A trên Mac) hoặc gõ thêm '?admin' vào cuối đường dẫn trang web.");
                    }}
                    className="flex items-center gap-1.5 text-[10px] font-bold font-mono px-3 py-2 rounded-full bg-stone-900 border border-white/10 text-stone-400 hover:text-stone-200 hover:border-white/20 hover:bg-stone-850 cursor-pointer transition-all"
                    title="Kích hoạt chế độ ẩn danh (ẩn hoàn toàn nút CMS)"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>CHẾ ĐỘ ẨN DANH</span>
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className="flex items-center gap-2 text-xs bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold px-4 py-2.5 rounded-full cursor-pointer transition-all uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50"
                  >
                    {isSaving ? (
                      <div className="w-3.5 h-3.5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    <span>LƯU NGAY</span>
                  </button>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-stone-400 hover:text-white hover:bg-white/15 cursor-pointer flex items-center justify-center transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Status Alert */}
              <AnimatePresence>
                {saveStatus !== "idle" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className={`px-6 py-3 border-b flex items-center gap-3 text-xs font-semibold ${
                      saveStatus === "success" 
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                        : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                    }`}
                  >
                    {saveStatus === "success" ? (
                      <CheckCircle className="w-4 h-4 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0" />
                    )}
                    <span>{statusMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tab Navigation */}
              <div className="flex border-b border-white/5 bg-stone-950/40 overflow-x-auto scrollbar-none shrink-0">
                {(Object.keys(tabMapping) as AdminTab[]).map((tab) => {
                  const info = tabMapping[tab];
                  const Icon = info.icon;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex items-center gap-2 px-5 py-4 border-b-2 text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                        activeTab === tab
                          ? "border-amber-400 text-amber-300 bg-white/[0.02]"
                          : "border-transparent text-stone-400 hover:text-stone-200"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{info.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Editable Fields Content Form Wrapper */}
              <form 
                onSubmit={handleSubmit}
                className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 font-sans text-stone-300"
              >
                {/* 1. HERO TAB */}
                {activeTab === "hero" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-mono text-stone-400 block mb-2 uppercase tracking-wide">TÊN SITE (siteName)</label>
                        <input
                          type="text"
                          value={formData.system.siteName}
                          onChange={(e) => updateSystemField("siteName", e.target.value)}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-400/50"
                          placeholder="Ví dụ: Phúc Vương Portfolio"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono text-stone-400 block mb-2 uppercase tracking-wide">TÊN CHÍNH HERO (Heading)</label>
                        <input
                          type="text"
                          value={formData.hero.heading}
                          onChange={(e) => updateNestedField("hero", "heading", e.target.value)}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-400/50 uppercase"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-mono text-stone-400 block mb-2 uppercase tracking-wide">MÔ TẢ CHIẾN DỊCH (Subheading)</label>
                      <textarea
                        value={formData.hero.subheading}
                        onChange={(e) => updateNestedField("hero", "subheading", e.target.value)}
                        rows={3}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-400/50 resize-none leading-relaxed"
                      />
                    </div>

                    <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-4">
                      <h4 className="text-xs font-mono uppercase text-amber-300 tracking-wider">Cấu trúc dòng chạy chữ nghệ thuật</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-mono text-stone-400 block mb-1 uppercase">TIỀN TỐ (Role Prefix)</label>
                          <input
                            type="text"
                            value={formData.hero.rolePrefix || ""}
                            onChange={(e) => updateNestedField("hero", "rolePrefix", e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400/50"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-mono text-stone-400 block mb-1 uppercase">HẬU TỐ (Role Suffix)</label>
                          <input
                            type="text"
                            value={formData.hero.roleSuffix || ""}
                            onChange={(e) => updateNestedField("hero", "roleSuffix", e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400/50"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-mono text-stone-400 block mb-2 uppercase">DANH SÁCH VAI TRÒ CHẠY CHỮ (Roles Tags)</label>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          {formData.hero.roles.map((tag, idx) => (
                            <span 
                              key={idx}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-stone-200"
                            >
                              <span>{tag}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveRole(idx)}
                                className="text-stone-400 hover:text-rose-400 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </span>
                          ))}

                          {showRoleInput ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={newRoleInput}
                                onChange={(e) => setNewRoleInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    if (newRoleInput.trim()) {
                                      setFormData((prev) => {
                                        const cloned = { ...prev };
                                        cloned.hero.roles = [...cloned.hero.roles, newRoleInput.trim()];
                                        return cloned;
                                      });
                                      setNewRoleInput("");
                                      setShowRoleInput(false);
                                    }
                                  } else if (e.key === "Escape") {
                                    setShowRoleInput(false);
                                    setNewRoleInput("");
                                  }
                                }}
                                className="bg-stone-950 border border-amber-400/50 rounded-full px-3 py-1 text-xs text-white focus:outline-none w-36"
                                placeholder="Vai trò mới..."
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  if (newRoleInput.trim()) {
                                    setFormData((prev) => {
                                      const cloned = { ...prev };
                                      cloned.hero.roles = [...cloned.hero.roles, newRoleInput.trim()];
                                      return cloned;
                                    });
                                    setNewRoleInput("");
                                    setShowRoleInput(false);
                                  }
                                }}
                                className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/35 flex items-center justify-center text-xs font-bold cursor-pointer transition-all"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowRoleInput(false);
                                  setNewRoleInput("");
                                }}
                                className="w-7 h-7 rounded-full bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 flex items-center justify-center text-xs cursor-pointer transition-all"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setShowRoleInput(true)}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium transition-all cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              VAI TRÒ MỚI
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-mono text-stone-400 block mb-2 uppercase tracking-wide">ẢNH CHÂN DUNG HERO (portraitUrl)</label>
                        <input
                          type="text"
                          value={formData.hero.portraitUrl}
                          onChange={(e) => updateNestedField("hero", "portraitUrl", e.target.value)}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-3 text-xs text-stone-200 focus:outline-none focus:border-amber-400/50"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono text-stone-400 block mb-2 uppercase tracking-wide">NÚT CTA LIÊN HỆ (contactCta)</label>
                        <input
                          type="text"
                          value={formData.hero.contactCta}
                          onChange={(e) => updateNestedField("hero", "contactCta", e.target.value)}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-400/50"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. ABOUT TAB */}
                {activeTab === "about" && (
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-mono text-stone-400 block mb-2 uppercase tracking-wide">TIÊU ĐỀ NỔI (Heading)</label>
                      <input
                        type="text"
                        value={formData.about.heading}
                        onChange={(e) => updateNestedField("about", "heading", e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-400/50"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono text-stone-400 block mb-2 uppercase tracking-wide">ĐOẠN VĂN GIỚI THIỆU CHÍNH (Paragraph)</label>
                      <textarea
                        value={formData.about.paragraph}
                        onChange={(e) => updateNestedField("about", "paragraph", e.target.value)}
                        rows={4}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-400/50 resize-none leading-relaxed"
                      />
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-mono uppercase text-amber-300 tracking-wider">Hộp Thẻ Kép Hiệu Ứng Nghiêng 3D</h4>
                      {formData.about.cards.map((card, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-white/5 bg-white/[0.01] grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-mono text-stone-400 block mb-1 uppercase">THẺ {idx + 1}: TIÊU ĐỀ</label>
                            <input
                              type="text"
                              value={card.title}
                              onChange={(e) => {
                                const cardsCloned = [...formData.about.cards];
                                cardsCloned[idx].title = e.target.value;
                                updateNestedField("about", "cards", cardsCloned);
                              }}
                              className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400/50"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-mono text-stone-400 block mb-1 uppercase">THẺ {idx + 1}: NỘI DUNG</label>
                            <input
                              type="text"
                              value={card.text}
                              onChange={(e) => {
                                const cardsCloned = [...formData.about.cards];
                                cardsCloned[idx].text = e.target.value;
                                updateNestedField("about", "cards", cardsCloned);
                              }}
                              className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400/50"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-mono text-stone-400 block mb-2 uppercase tracking-wide">LINK HÌNH ẢNH MINH HỌA (interactiveImg)</label>
                        <input
                          type="text"
                          value={formData.about.interactiveImg}
                          onChange={(e) => updateNestedField("about", "interactiveImg", e.target.value)}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-3 text-xs text-stone-200 focus:outline-none focus:border-amber-400/50"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono text-stone-400 block mb-2 uppercase tracking-wide">NÚT CTA LIÊN HỆ DƯỚI (contactCta)</label>
                        <input
                          type="text"
                          value={formData.about.contactCta}
                          onChange={(e) => updateNestedField("about", "contactCta", e.target.value)}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-400/50"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. PROJECTS TAB */}
                {activeTab === "projects" && (() => {
                  const updateProj = (index: number, field: keyof ProjectItem, value: any) => {
                    setFormData((prev: any) => {
                      const cloned = JSON.parse(JSON.stringify(prev));
                      cloned.projects.list[index][field] = value;
                      return cloned;
                    });
                  };
                  return (
                    <div className="space-y-6 text-stone-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <div>
                          <label className="text-xs font-mono text-stone-400 block uppercase tracking-wide">TIÊU ĐỀ TRANG DỰ ÁN (Heading)</label>
                          <input
                            type="text"
                            value={formData.projects.heading}
                            onChange={(e) => updateNestedField("projects", "heading", e.target.value)}
                            className="mt-1.5 w-full sm:w-80 bg-stone-950 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-400/50"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleAddProject}
                          className="self-end sm:self-center flex items-center gap-1.5 text-xs font-bold bg-amber-500 text-stone-950 px-5 py-3 rounded-full cursor-pointer hover:bg-amber-400 transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)]"
                        >
                          <Plus className="w-4 h-4" />
                          THÊM MỘT VIDEO DỰ ÁN MỚI
                        </button>
                      </div>

                      <div className="space-y-8">
                        {formData.projects.list.map((proj, idx) => {
                          const isGDriveVideo = localIsGoogleDriveUrl(proj.videoUrl);
                          const embedUrl = isGDriveVideo ? localGetGoogleDriveEmbedUrl(proj.videoUrl) : proj.videoUrl;
                          const displayThumb = localGetGoogleDriveImageUrl(proj.thumbUrl);
                          const isTestingPlay = testingVideoIndex === idx;

                          return (
                            <div 
                              key={proj.number} 
                              className="p-6 rounded-2xl border border-white/10 bg-white/[0.01] hover:border-white/20 transition-all relative group/item"
                            >
                              {/* Card Action Controls */}
                              <div className="absolute top-4 right-4 flex items-center gap-1 bg-stone-950/90 px-2.5 py-1.5 rounded-lg border border-white/10 z-10 shadow-lg">
                                <button
                                  type="button"
                                  onClick={() => handleMoveProject(idx, "up")}
                                  disabled={idx === 0}
                                  className="p-1 hover:text-amber-400 cursor-pointer disabled:opacity-20 disabled:pointer-events-none transition-all"
                                  title="Di chuyển lên"
                                >
                                  <ArrowUp className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveProject(idx, "down")}
                                  disabled={idx === formData.projects.list.length - 1}
                                  className="p-1 hover:text-amber-400 cursor-pointer disabled:opacity-20 disabled:pointer-events-none transition-all"
                                  title="Di chuyển xuống"
                                >
                                  <ArrowDown className="w-4 h-4" />
                                </button>
                                <div className="w-px h-4 bg-white/10 mx-1" />
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProject(idx)}
                                  className="p-1 text-stone-500 hover:text-rose-400 cursor-pointer transition-all"
                                  title="Xóa dự án"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Card heading */}
                              <div className="flex items-center gap-2 mb-5">
                                <span className="font-mono text-xs text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-sm">
                                  #{proj.number}
                                </span>
                                <span className="text-white font-bold text-xs tracking-wider uppercase">CẤU HÌNH DỰ ÁN CHI TIẾT</span>
                              </div>

                              {/* Split Layout: Inputs Left (8 cols) & Live Preview Right (4 cols) */}
                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
                                
                                {/* Left Side: Interactive Input Fields */}
                                <div className="lg:col-span-8 space-y-4">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-[10px] sm:text-xs font-mono text-stone-400 block mb-1 uppercase tracking-wide">TIÊU ĐỀ DỰ ÁN (Name)</label>
                                      <input
                                        type="text"
                                        value={proj.name}
                                        onChange={(e) => updateProj(idx, "name", e.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400/50"
                                        placeholder="Ví dụ: Owen Fashion Campaign..."
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[10px] sm:text-xs font-mono text-stone-400 block mb-1 uppercase tracking-wide">DANH MỤC THỂ LOẠI (Category)</label>
                                      <input
                                        type="text"
                                        value={proj.category}
                                        onChange={(e) => updateProj(idx, "category", e.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400/50"
                                        placeholder="Ví dụ: Cinematic Video / Commercial..."
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-[10px] sm:text-xs font-mono text-stone-400 block mb-1 uppercase tracking-wide flex items-center justify-between">
                                        <span>LINK TRÌNH PHÁT VIDEO</span>
                                        <span className="text-[9px] text-[#89AACC] font-normal lowercase">Hỗ trợ drive.google & asset cục bộ</span>
                                      </label>
                                      <input
                                        type="text"
                                        value={proj.videoUrl}
                                        onChange={(e) => updateProj(idx, "videoUrl", e.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-2.5 text-[11px] text-sky-400 font-mono focus:outline-none focus:border-amber-400/50"
                                        placeholder="Nhập đường link video..."
                                      />

                                      {/* Intelligent URL fixer helper */}
                                      {isGDriveVideo && proj.videoUrl.includes("/view") && !proj.videoUrl.includes("/preview") && (
                                        <div className="mt-1.5 flex items-center justify-between bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg text-[10px] text-amber-300">
                                          <span>Link chia sẻ cần chuyển sang định dạng Trình phát (preview)</span>
                                          <button
                                            type="button"
                                            onClick={() => updateProj(idx, "videoUrl", localGetGoogleDriveEmbedUrl(proj.videoUrl))}
                                            className="bg-amber-500 text-stone-900 px-2 py-0.5 rounded font-bold cursor-pointer hover:bg-amber-400 text-[9px]"
                                          >
                                            SỬA LINK TỰ ĐỘNG
                                          </button>
                                        </div>
                                      )}
                                    </div>

                                    <div>
                                      <label className="text-[10px] sm:text-xs font-mono text-stone-400 block mb-1 uppercase tracking-wide">ĐƯỜNG LINK ẢNH THUMBNAIL (thumbUrl)</label>
                                      <input
                                        type="text"
                                        value={proj.thumbUrl}
                                        onChange={(e) => updateProj(idx, "thumbUrl", e.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-2.5 text-[11px] text-stone-300 font-mono focus:outline-none focus:border-amber-400/50"
                                        placeholder="https://images.unsplash.com/... hoặc link Google Drive"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-[10px] sm:text-xs font-mono text-stone-400 block mb-1 uppercase tracking-wide">ĐOẠN MÔ TẢ PHƯƠNG PHÁP & KẾT QUẢ (desc)</label>
                                    <textarea
                                      value={proj.desc}
                                      onChange={(e) => updateProj(idx, "desc", e.target.value)}
                                      rows={3}
                                      className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400/50 resize-none leading-relaxed"
                                      placeholder="Mô tả kỹ thuật hậu kỳ, thiết kế âm thanh, hiệu quả thu hút khách hàng..."
                                    />
                                  </div>
                                </div>

                                {/* Right Side: Dynamic Mockup & Presets Card */}
                                <div className="lg:col-span-4 flex flex-col justify-between space-y-4 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6">
                                  
                                  {/* Miniature live preview banner */}
                                  <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                      <span className="text-[10px] font-mono uppercase text-stone-400 flex items-center gap-1">
                                        <Eye className="w-3 h-3 text-[#89AACC]" /> BẢN XEM TRƯỚC (LIVE CARD)
                                      </span>
                                      
                                      {/* Active streaming badge indicator */}
                                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${
                                        isGDriveVideo ? "bg-blue-500/10 text-blue-300" : "bg-emerald-500/10 text-emerald-300"
                                      }`}>
                                        {isGDriveVideo ? "Google Drive Stream" : "Video Trực Tiếp"}
                                      </span>
                                    </div>

                                    {/* Project Card Mirror */}
                                    <div className="relative w-full aspect-[16/10] bg-stone-950 rounded-xl overflow-hidden border border-white/10 shadow-lg group/preview">
                                      {isTestingPlay ? (
                                        <div className="absolute inset-0 w-full h-full bg-black">
                                          {isGDriveVideo ? (
                                            <iframe
                                              src={embedUrl}
                                              className="w-full h-full border-0 absolute inset-0"
                                              allow="autoplay; encrypted-media"
                                              title={proj.name}
                                            />
                                          ) : (
                                            <video
                                              src={proj.videoUrl}
                                              autoPlay
                                              controls
                                              className="w-full h-full object-contain"
                                            />
                                          )}
                                          
                                          {/* Close player button overlay */}
                                          <button
                                            type="button"
                                            onClick={() => setTestingVideoIndex(null)}
                                            className="absolute top-2 right-2 bg-black/80 hover:bg-black text-rose-400 p-1 rounded-md border border-white/10 z-20 cursor-pointer text-xs"
                                          >
                                            <X className="w-3 h-3" />
                                          </button>
                                        </div>
                                      ) : (
                                        <>
                                          {/* Normal preview screen showing thumbnail image */}
                                          <img
                                            src={displayThumb || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800"}
                                            alt="Preview"
                                            className="absolute inset-0 w-full h-full object-cover brightness-75 scale-100 group-hover/preview:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                              // fallback
                                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800";
                                            }}
                                          />

                                          {/* Center Play Button Simulator */}
                                          <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-black/45 z-10">
                                            <button
                                              type="button"
                                              onClick={() => {
                                                if (proj.videoUrl) {
                                                  setTestingVideoIndex(idx);
                                                } else {
                                                  alert("Vui lòng nhập đường dẫn video hợp lệ trước khi phát thử!");
                                                }
                                              }}
                                              className="w-10 h-10 rounded-full bg-[#89AACC] text-stone-950 flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-md"
                                              title="Phát thử video tại đây"
                                            >
                                              <Play className="w-4 h-4 fill-current ml-0.5" />
                                            </button>
                                            <span className="text-[9px] font-mono tracking-widest text-[#89AACC] mt-2 bg-black/60 px-2 py-0.5 rounded uppercase">Phát Thử Trình Phát</span>
                                          </div>

                                          {/* Badge number */}
                                          <span className="absolute top-2.5 left-2.5 z-20 text-[9px] font-mono font-black text-white/70 bg-black/60 px-2 py-0.5 rounded-sm border border-white/5">
                                            {proj.number}
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  {/* Cinema Image Presets Selectable Grid */}
                                  <div className="mt-1">
                                    <span className="text-[9px] font-mono text-stone-400 block mb-1.5 uppercase tracking-wide flex items-center gap-1">
                                      <Sparkles className="w-3 h-3 text-amber-400" /> CHỌN NHANH ẢNH THUMBNAIL ĐIỆN ẢNH
                                    </span>
                                    <div className="grid grid-cols-3 gap-1.5">
                                      {THUMBNAIL_PRESETS.map((p, pIdx) => (
                                        <button
                                          key={pIdx}
                                          type="button"
                                          onClick={() => updateProj(idx, "thumbUrl", p.url)}
                                          className={`relative h-10 rounded-md overflow-hidden bg-stone-900 border transition-all cursor-pointer ${
                                            proj.thumbUrl === p.url ? "border-amber-400 scale-[0.97] ring-1 ring-amber-400/30" : "border-white/5 hover:border-white/20"
                                          }`}
                                          title={p.name}
                                        >
                                          <img src={p.url} className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" alt="Preset" />
                                          <div className="absolute inset-x-0 bottom-0 py-0.5 text-[7px] text-center bg-black/60 text-stone-300 font-sans truncate px-0.5">
                                            {p.name}
                                          </div>
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                </div>

                              </div>

                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* 4. EXPERIENCE TAB */}
                {activeTab === "experience" && (() => {
                  const updateMilestoneField = (index: number, field: keyof MilestoneItem, value: string) => {
                    setFormData((prev: any) => {
                      const cloned = JSON.parse(JSON.stringify(prev));
                      cloned.experience.milestones[index][field] = value;
                      return cloned;
                    });
                  };

                  const SUGGESTED_ROLES = [
                    "Freelance Lead Video Editor",
                    "Senior Video Editor",
                    "Motion Designer",
                    "Colorist & Post Assistant",
                    "Thực tập sinh Biên tập Video"
                  ];

                  const SUGGESTED_TIMES = [
                    "Hiện tại -- Freelance",
                    "03/2026 - Hiện tại",
                    "2025 - 2026",
                    "2024 - 2025",
                    "09/2025 - 03/2026"
                  ];

                  const SUGGESTED_EMPLOYERS = [
                    "Khách hàng quốc tế qua Upwork & Fiverr",
                    "Tổ chức nghệ thuật & Bảo tàng",
                    "Tập đoàn truyền thông VTVCab",
                    "Creative Production Agency",
                    "Công ty TNHH Thời trang cao cấp"
                  ];

                  return (
                    <div className="space-y-6 text-stone-200">
                      {/* Top Header Section */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <div>
                          <label className="text-xs font-mono text-stone-400 block uppercase tracking-wide">TIÊU ĐỀ LỘ TRÌNH KINH NGHIỆM (Heading)</label>
                          <input
                            type="text"
                            value={formData.experience.heading}
                            onChange={(e) => updateNestedField("experience", "heading", e.target.value)}
                            className="mt-1.5 w-full sm:w-80 bg-stone-950 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-400/50"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleAddMilestone}
                          className="self-end sm:self-center flex items-center gap-1.5 text-xs font-bold bg-amber-500 text-stone-950 px-5 py-3 rounded-full cursor-pointer hover:bg-amber-400 transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)]"
                        >
                          <Plus className="w-4 h-4" />
                          THÊM MỘT MỐC KINH NGHIỆM MỚI
                        </button>
                      </div>

                      {/* Milestones Catalog */}
                      <div className="space-y-8">
                        {formData.experience.milestones.map((mile, idx) => (
                          <div 
                            key={idx} 
                            className="p-6 rounded-2xl border border-white/10 bg-white/[0.01] hover:border-white/20 transition-all relative group/mile"
                          >
                            {/* Card Control Actions */}
                            <div className="absolute top-4 right-4 flex items-center gap-1 bg-stone-950/90 px-2.5 py-1.5 rounded-lg border border-white/10 z-10 shadow-lg">
                              <button
                                type="button"
                                onClick={() => handleMoveMilestone(idx, "up")}
                                disabled={idx === 0}
                                className="p-1 hover:text-amber-400 cursor-pointer disabled:opacity-20 disabled:pointer-events-none transition-all"
                                title="Di chuyển lên"
                              >
                                <ArrowUp className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveMilestone(idx, "down")}
                                disabled={idx === formData.experience.milestones.length - 1}
                                className="p-1 hover:text-amber-400 cursor-pointer disabled:opacity-20 disabled:pointer-events-none transition-all"
                                title="Di chuyển xuống"
                              >
                                <ArrowDown className="w-4 h-4" />
                              </button>
                              <div className="w-px h-4 bg-white/10 mx-1" />
                              <button
                                type="button"
                                onClick={() => handleDeleteMilestone(idx)}
                                className="p-1 text-stone-500 hover:text-rose-400 cursor-pointer transition-all"
                                title="Xóa mốc kinh nghiệm"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Badge header index indicator */}
                            <div className="flex items-center gap-2 mb-5">
                              <span className="font-mono text-xs text-[#89AACC] font-black bg-white/5 border border-white/10 px-3 py-1 rounded-sm">
                                {String(idx + 1).padStart(2, "0")}
                              </span>
                              <span className="text-white font-bold text-xs tracking-wider uppercase">CẤU HÌNH LỘ TRÌNH CHI TIẾT</span>
                            </div>

                            {/* Two Column Layout: Editor Inputs left, real-time live preview panel right */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
                              
                              {/* Left Panel: Field Configuration + Preset Quick Selectors */}
                              <div className="lg:col-span-8 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                  
                                  {/* Khung thời gian info */}
                                  <div>
                                    <label className="text-[10px] sm:text-xs font-mono text-stone-400 block mb-1 uppercase tracking-wider">KHUNG THỜI GIAN (Time)</label>
                                    <input
                                      type="text"
                                      value={mile.time}
                                      onChange={(e) => updateMilestoneField(idx, "time", e.target.value)}
                                      className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400/50"
                                      placeholder="Ví dụ: Hiện tại -- Freelance"
                                    />
                                    
                                    {/* Quick Preset Selector */}
                                    <div className="mt-1.5 flex flex-wrap gap-1">
                                      {SUGGESTED_TIMES.map((tVal, tIdx) => (
                                        <button
                                          key={tIdx}
                                          type="button"
                                          onClick={() => updateMilestoneField(idx, "time", tVal)}
                                          className="text-[9px] font-sans px-1.5 py-0.5 rounded bg-white/5 hover:bg-amber-500/10 hover:text-amber-300 text-stone-400 border border-white/5 transition-all cursor-pointer"
                                        >
                                          {tVal.split(' ')[0]}...
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Chức danh info */}
                                  <div>
                                    <label className="text-[10px] sm:text-xs font-mono text-stone-400 block mb-1 uppercase tracking-wider">CHỨC DANH / VAI TRÒ (Role)</label>
                                    <input
                                      type="text"
                                      value={mile.role}
                                      onChange={(e) => updateMilestoneField(idx, "role", e.target.value)}
                                      className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400/50"
                                      placeholder="Ví dụ: Lead Video Editor"
                                    />
                                    
                                    {/* Quick Preset Selector */}
                                    <div className="mt-1.5 flex flex-wrap gap-1">
                                      {SUGGESTED_ROLES.map((rVal, rIdx) => (
                                        <button
                                          key={rIdx}
                                          type="button"
                                          onClick={() => updateMilestoneField(idx, "role", rVal)}
                                          className="text-[9px] font-sans px-1.5 py-0.5 rounded bg-white/5 hover:bg-amber-500/10 hover:text-amber-300 text-stone-400 border border-white/5 transition-all cursor-pointer"
                                          title={rVal}
                                        >
                                          {rVal.split(' ').slice(-2).join(' ')}
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Nhà tuyển dụng info */}
                                  <div>
                                    <label className="text-[10px] sm:text-xs font-mono text-stone-400 block mb-1 uppercase tracking-wider">NHÀ TUYỂN DỤNG / ĐỐI TÁC (Employer)</label>
                                    <input
                                      type="text"
                                      value={mile.employer}
                                      onChange={(e) => updateMilestoneField(idx, "employer", e.target.value)}
                                      className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400/50"
                                      placeholder="Ví dụ: Khách hàng Upwork & Fiverr"
                                    />
                                    
                                    {/* Quick Preset Selector */}
                                    <div className="mt-1.5 flex flex-wrap gap-1">
                                      {SUGGESTED_EMPLOYERS.map((eVal, eIdx) => (
                                        <button
                                          key={eIdx}
                                          type="button"
                                          onClick={() => updateMilestoneField(idx, "employer", eVal)}
                                          className="text-[9px] font-sans px-1.5 py-0.5 rounded bg-white/5 hover:bg-amber-500/10 hover:text-amber-300 text-stone-400 border border-white/5 transition-all cursor-pointer"
                                          title={eVal}
                                        >
                                          {eVal.split(' ').slice(-2).join(' ')}
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                </div>

                                {/* Milestone Descriptions (details) */}
                                <div>
                                  <label className="text-[10px] sm:text-xs font-mono text-stone-400 block mb-1 uppercase tracking-wider">THÀNH TỰU & KẾT QUẢ KỸ THUẬT (details)</label>
                                  <textarea
                                    value={mile.details}
                                    onChange={(e) => updateMilestoneField(idx, "details", e.target.value)}
                                    rows={4}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400/50 resize-none leading-relaxed"
                                    placeholder="Biên tập video chuyên nghiệp cho đối tác... Hãy chia sẻ cụ thể công nghệ hậu kỳ, doanh thu nâng cao, hoặc các sản phẩm tiêu biểu!"
                                  />
                                </div>
                              </div>

                              {/* Right Panel: Sleek Live View Mimicry */}
                              <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6 space-y-3">
                                <span className="text-[10px] font-mono uppercase text-stone-400 flex items-center gap-1 mb-1">
                                  <Eye className="w-3.5 h-3.5 text-[#89AACC]" /> BẢN MÔ PHỎNG LỘ TRÌNH (PREVIEW CARD)
                                </span>

                                {/* Simulated Card layout with custom liquid glass effect */}
                                <div className="liquid-glass rounded-2xl p-5 border border-white/10 bg-white/[0.02] text-left relative overflow-hidden shadow-lg select-none">
                                  {/* Top timeline connector nodes inside simulation */}
                                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#89AACC]/30 via-white/5 to-transparent"></div>
                                  
                                  <div className="flex items-center justify-between gap-2 mb-3">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white/5 border border-white/10 rounded-full font-mono text-[9px] uppercase font-bold text-[#89AACC]">
                                      <Calendar className="w-3" />
                                      {mile.time || "CHƯA NHẬP"}
                                    </span>
                                    
                                    <span className="text-[8px] text-stone-500 font-mono tracking-wider uppercase">
                                      #{String(idx + 1).padStart(2, "0")} MILESTONE
                                    </span>
                                  </div>

                                  <h4 className="text-base font-display-italic italic font-bold text-white tracking-wide mb-0.5 truncate">
                                    {mile.role || "Chưa nhập chức danh..."}
                                  </h4>

                                  <div className="text-[10px] font-semibold text-[#89AACC] uppercase tracking-widest mb-3 truncate">
                                    {mile.employer || "Chưa nhập nhà tuyển dụng..."}
                                  </div>

                                  <p className="text-stone-400 text-xs leading-relaxed font-light line-clamp-3">
                                    {mile.details || "Nhập các thành tựu, phần mềm dựng, và các thông tin dự án nổi bật."}
                                  </p>

                                  {/* Custom dynamic pills */}
                                  <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap gap-1.5 opacity-80">
                                    <span className="inline-flex text-[8px] uppercase tracking-wider font-semibold font-mono px-2 py-0.5 rounded bg-[#89AACC]/10 text-[#89AACC]">
                                      Active Pipeline
                                    </span>
                                    <span className="inline-flex text-[8px] uppercase tracking-wider font-semibold font-mono px-2 py-0.5 rounded bg-white/5 text-stone-300">
                                      Production
                                    </span>
                                  </div>
                                </div>

                                <div className="p-3 bg-stone-900/50 border border-white/5 rounded-xl text-[10px] text-stone-400 leading-relaxed font-sans">
                                  <strong className="text-amber-400 font-mono block mb-1">MẸO BIÊN SOẠN CHUYÊN NGHIỆP:</strong>
                                  Hãy sử dụng từ hành động mạnh ở đầu mô tả để tăng tính thuyết phục (ví dụ: <span className="text-emerald-400">"Biên tập..."</span>, <span className="text-emerald-400">"Tối ưu hóa..."</span>, <span className="text-emerald-400">"Sản xuất..."</span>).
                                </div>
                              </div>

                            </div>

                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* 5. SKILLS TAB */}
                {activeTab === "skills" && (
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-mono text-stone-400 block mb-2 uppercase tracking-wide">TIÊU ĐỀ TRANG KỸ NĂNG (Heading)</label>
                      <input
                        type="text"
                        value={formData.skills.heading}
                        onChange={(e) => updateNestedField("skills", "heading", e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-400/50"
                      />
                    </div>

                    <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-4">
                      <h4 className="text-xs font-mono uppercase text-amber-300 tracking-wider">Thanh kỹ năng phần mềm (Software Progress Bars)</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {formData.skills.software.map((sw, idx) => (
                          <div key={idx} className="p-3 bg-stone-950/40 rounded-lg border border-white/5 space-y-2">
                            <span className="text-xs font-bold text-white block">PHẦN MỀM {idx + 1}: {sw.name}</span>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[9px] font-mono text-stone-400 block">Tên</label>
                                <input
                                  type="text"
                                  value={sw.name}
                                  onChange={(e) => {
                                    const softwareCloned = [...formData.skills.software];
                                    softwareCloned[idx].name = e.target.value;
                                    updateNestedField("skills", "software", softwareCloned);
                                  }}
                                  className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] font-mono text-stone-400 block">Phần Trăm (%)</label>
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={sw.percentage}
                                  onChange={(e) => {
                                    const softwareCloned = [...formData.skills.software];
                                    softwareCloned[idx].percentage = Number(e.target.value);
                                    updateNestedField("skills", "software", softwareCloned);
                                  }}
                                  className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] space-y-4">
                      <h4 className="text-xs font-mono uppercase text-amber-300 tracking-wider">Hộp Thể Loại Định Dạng Phim (Format Columns)</h4>
                      <div className="space-y-3">
                        {formData.skills.formats.map((fmt, idx) => (
                          <div key={idx} className="p-3 bg-stone-950/40 rounded-lg border border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[9px] font-mono text-stone-400 block">Định Dạng Tên</label>
                              <input
                                type="text"
                                value={fmt.name}
                                onChange={(e) => {
                                  const formatsCloned = [...formData.skills.formats];
                                  formatsCloned[idx].name = e.target.value;
                                  updateNestedField("skills", "formats", formatsCloned);
                                }}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-mono text-stone-400 block">Mô tả đặc quyền</label>
                              <input
                                type="text"
                                value={fmt.desc}
                                onChange={(e) => {
                                  const formatsCloned = [...formData.skills.formats];
                                  formatsCloned[idx].desc = e.target.value;
                                  updateNestedField("skills", "formats", formatsCloned);
                                }}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. CONTACT TAB */}
                {activeTab === "contact" && (
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-mono text-stone-400 block mb-2 uppercase tracking-wide">TIÊU ĐỀ KHU VỰC LIÊN HỆ (Heading)</label>
                      <input
                        type="text"
                        value={formData.contact.heading}
                        onChange={(e) => updateNestedField("contact", "heading", e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-400/50"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono text-stone-400 block mb-2 uppercase tracking-wide">PHỤ ĐỀ LIÊN HỆ (Subheading)</label>
                      <textarea
                        value={formData.contact.subheading}
                        onChange={(e) => updateNestedField("contact", "subheading", e.target.value)}
                        rows={3}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-400/50 resize-none leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-mono text-stone-400 block mb-1 uppercase">SỐ ĐIỆN THOẠI (Phone)</label>
                        <input
                          type="text"
                          value={formData.contact.phone}
                          onChange={(e) => updateNestedField("contact", "phone", e.target.value)}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400/50"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono text-stone-400 block mb-1 uppercase">ĐỊA CHỈ EMAIL (Email)</label>
                        <input
                          type="email"
                          value={formData.contact.email}
                          onChange={(e) => updateNestedField("contact", "email", e.target.value)}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400/50"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono text-stone-400 block mb-1 uppercase">TÊN HIỂN THỊ FACEBOOK</label>
                        <input
                          type="text"
                          value={formData.contact.facebook}
                          onChange={(e) => updateNestedField("contact", "facebook", e.target.value)}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400/50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-mono text-stone-400 block mb-1 uppercase">LINK FACEBOOK (facebookUrl)</label>
                        <input
                          type="text"
                          value={formData.contact.facebookUrl || ""}
                          onChange={(e) => updateNestedField("contact", "facebookUrl", e.target.value)}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-2.5 text-xs text-[10px] font-mono focus:outline-none focus:border-amber-400/50"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono text-stone-400 block mb-1 uppercase">LINK GITHUB (githubUrl)</label>
                        <input
                          type="text"
                          value={formData.contact.githubUrl || ""}
                          onChange={(e) => updateNestedField("contact", "githubUrl", e.target.value)}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-2.5 text-xs text-[10px] font-mono focus:outline-none focus:border-amber-400/50"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono text-stone-400 block mb-1 uppercase">LINK YOUTUBE (youtubeUrl)</label>
                        <input
                          type="text"
                          value={formData.contact.youtubeUrl || ""}
                          onChange={(e) => updateNestedField("contact", "youtubeUrl", e.target.value)}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-2.5 text-xs text-[10px] font-mono focus:outline-none focus:border-amber-400/50"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono text-stone-300 block mb-1 uppercase text-pink-400">LINK TIKTOK (tiktokUrl)</label>
                        <input
                          type="text"
                          value={formData.contact.tiktokUrl || ""}
                          onChange={(e) => updateNestedField("contact", "tiktokUrl", e.target.value)}
                          className="w-full bg-white/[0.03] border border-pink-500/20 hover:border-pink-500/40 focus:border-pink-500/60 rounded-lg p-2.5 text-xs text-[10px] font-mono focus:outline-none"
                          placeholder="https://tiktok.com/@..."
                        />
                      </div>
                      <div>
                        <label className="text-xs font-mono text-stone-300 block mb-1 uppercase text-[#E1306C]">LINK INSTAGRAM (instagramUrl)</label>
                        <input
                          type="text"
                          value={formData.contact.instagramUrl || ""}
                          onChange={(e) => updateNestedField("contact", "instagramUrl", e.target.value)}
                          className="w-full bg-white/[0.03] border border-[#E1306C]/20 hover:border-[#E1306C]/40 focus:border-[#E1306C]/60 rounded-lg p-2.5 text-xs text-[10px] font-mono focus:outline-none"
                          placeholder="https://instagram.com/..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-mono text-stone-400 block mb-2 uppercase tracking-wide">CHỮ TRÊN NÚT HOA CTA GỬI THƯ (ctaLabel)</label>
                      <input
                        type="text"
                        value={formData.contact.ctaLabel}
                        onChange={(e) => updateNestedField("contact", "ctaLabel", e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-400/50"
                      />
                    </div>
                  </div>
                )}
              </form>

              {/* Reset Details */}
              <div className="p-4 bg-stone-950/60 border-t border-white/5 text-[10px] font-mono text-stone-500 flex justify-between tracking-widest uppercase">
                <span>PORTFOLIO BUILD ENGINE v1.1.0</span>
                <span>SECURED CMS CONTROL</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const tabMapping: Record<AdminTab, { label: string; icon: any }> = {
  hero: { label: "Hero & Banner", icon: Layers },
  about: { label: "Về Tôi", icon: AlignLeft },
  projects: { label: "Kho Dự Án", icon: Film },
  experience: { label: "Lộ Trình", icon: Briefcase },
  skills: { label: "Kỹ Năng", icon: Sparkles },
  contact: { label: "Thông Tin Liên Hệ", icon: Phone },
};
