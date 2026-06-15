import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Compass, HelpCircle, X, Check, Copy, ExternalLink, RefreshCw, Layers, Database, FileVideo, HardDrive } from "lucide-react";

interface UploadInstructionsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadInstructions({ isOpen, onClose }: UploadInstructionsProps) {
  const [activeTab, setActiveTab] = useState<"local" | "firebase" | "drive" | "naming">("local");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const codeExampleJson = `{
  "number": "03",
  "category": "Animation Talking Head & Motion Graphics",
  "name": "Cinematic Talking Head Showcase",
  "ctaLabel": "Xem Dự Án",
  "videoUrl": "/assets/Becomeaeditor  motiongraphic .mp4",
  "thumbUrl": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format...",
  "desc": "Tích hợp đồ họa chuyển động đỉnh cao..."
}`;

  const fbRulesExample = `rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-[#060606]/95 backdrop-blur-xl z-[99999] flex items-center justify-center p-4 sm:p-6 md:p-10 select-none overflow-y-auto"
        >
          {/* Backdrop mask */}
          <div className="absolute inset-0 cursor-zoom-out" onClick={onClose} />

          {/* Dialog Container */}
          <motion.div
            initial={{ scale: 0.95, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className="relative w-full max-w-4xl bg-gradient-to-b from-[#121217] to-[#0A0A0E] rounded-[32px] border border-white/10 overflow-hidden shadow-2xl z-10 flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between text-left backdrop-blur-md bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl neon-glass-purple flex items-center justify-center">
                  <Compass className="w-5 h-5 text-purple-400 animate-spin-slow" />
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#89AACC]">
                    BẢN HƯỚNG DẪN KỸ THUẬT
                  </span>
                  <h4 className="text-lg font-heading italic text-white font-bold tracking-wide">
                    Quản Lý Tài Nguyên & Thay Video Portfolio
                  </h4>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Inner Tabs and Content scroll area */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 flex flex-col md:flex-row gap-6">
              {/* Tab navigation left (desktop), pills top (mobile) */}
              <div className="flex md:flex-col gap-2 shrink-0 overflow-x-auto pb-2 md:pb-0 border-b md:border-b-0 border-white/5 md:w-52">
                <button
                  onClick={() => setActiveTab("local")}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl font-mono text-xs tracking-wider uppercase text-left transition-all cursor-pointer whitespace-nowrap md:w-full ${
                    activeTab === "local"
                      ? "bg-purple-600/20 border border-purple-500/40 text-purple-300"
                      : "bg-white/5 border border-white/5 text-stone-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <HardDrive className="w-4 h-4 text-purple-400" />
                  <span>1. Local Assets</span>
                </button>

                <button
                  onClick={() => setActiveTab("firebase")}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl font-mono text-xs tracking-wider uppercase text-left transition-all cursor-pointer whitespace-nowrap md:w-full ${
                    activeTab === "firebase"
                      ? "bg-purple-600/20 border border-purple-500/40 text-purple-300"
                      : "bg-white/5 border border-white/5 text-stone-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Database className="w-4 h-4 text-amber-400" />
                  <span>2. Cloud Storage</span>
                </button>

                <button
                  onClick={() => setActiveTab("naming")}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl font-mono text-xs tracking-wider uppercase text-left transition-all cursor-pointer whitespace-nowrap md:w-full ${
                    activeTab === "naming"
                      ? "bg-purple-600/20 border border-purple-500/40 text-purple-300"
                      : "bg-white/5 border border-white/5 text-stone-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>3. Chuẩn Naming</span>
                </button>
              </div>

              {/* Tab content right */}
              <div className="flex-1 text-left min-w-0">
                {activeTab === "local" && (
                  <div className="space-y-6">
                    <div>
                      <h5 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                        Tải Video/Asset Trực Tiếp Vào Source Code
                      </h5>
                      <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                        Bạn có thể tự do tải các tệp video và hình ảnh riêng của mình lên thư mục tài nguyên của website. Bạn vừa thực hiện tải tệp <code className="text-purple-400 bg-white/5 px-1.5 py-0.5 rounded font-mono font-semibold">Becomeaeditor  motiongraphic .mp4</code> vào thư mục assets của hệ thống!
                      </p>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0 font-bold text-xs">
                          A
                        </div>
                        <div>
                          <h6 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                            Thư Mục Lưu Trữ Cố Định
                          </h6>
                          <p className="text-stone-400 text-xs leading-relaxed">
                            Mọi tệp tin phương tiện của bạn cần được đặt trong: <code className="text-white/80 bg-white/5 px-1.5 py-0.5 rounded font-mono">/public/assets/</code>.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0 font-bold text-xs">
                          B
                        </div>
                        <div>
                          <h6 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                            Đường Dẫn Gọi Trong JSON
                          </h6>
                          <p className="text-stone-400 text-xs leading-relaxed">
                            Mở cấu trúc file dữ liệu <code className="text-white/80 bg-white/5 px-1.5 py-0.5 rounded font-mono">src/data/contentData.json</code> và tham chiếu tới đường dẫn bắt đầu bằng <code className="text-purple-300 font-mono font-semibold">/assets/</code>.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Code playground block */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono tracking-wider text-stone-500 uppercase">
                          Cú pháp mẫu trong JSON (src/data/contentData.json)
                        </span>
                        <button
                          onClick={() => copyToClipboard(codeExampleJson, "json")}
                          className="text-[10px] font-mono text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer bg-white/5 px-2 py-1 rounded"
                        >
                          {copiedText === "json" ? (
                            <>
                              <Check className="w-3" /> Đã sao chép
                            </>
                          ) : (
                            <>
                              <Copy className="w-3" /> Sao chép Cú Pháp
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-4 rounded-xl bg-[#09090D] overflow-x-auto text-[11px] text-zinc-300 font-mono border border-white/5 leading-relaxed select-text">
                        {codeExampleJson}
                      </pre>
                    </div>
                  </div>
                )}

                {activeTab === "firebase" && (
                  <div className="space-y-6">
                    <div>
                      <h5 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        Cấu Hình Firebase Storage Để Truy Xuất Cloud Tốc Độ Khủng
                      </h5>
                      <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                        Để tránh việc phình to kích thước cục bộ của source code và có tốc độ truyền tải video ưu việt, sử dụng Cloud Bucket của <strong>Firebase Storage</strong> là phương pháp tối ưu nhất.
                      </p>
                    </div>

                    {/* List Steps */}
                    <div className="space-y-3">
                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex gap-3">
                        <div className="text-amber-400 font-mono text-xs font-bold pt-0.5 shrink-0">01.</div>
                        <div>
                          <h6 className="text-xs font-bold text-white mb-0.5">Khởi tạo và Upload trên Console</h6>
                          <p className="text-stone-400 text-xs leading-relaxed">
                            Truy cập vào <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-blue-400 underline inline-flex items-center gap-0.5">Firebase Console <ExternalLink className="w-3 h-3" /></a>, bật chức năng <strong>Storage</strong> và tiến hành kéo thả tệp tin animation, motion graphics vào đó.
                          </p>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex gap-3">
                        <div className="text-amber-400 font-mono text-xs font-bold pt-0.5 shrink-0">02.</div>
                        <div>
                          <h6 className="text-xs font-bold text-white mb-0.5">Mở Quyền Truy Cập Công Khai (Công Đoạn Quan Trọng)</h6>
                          <p className="text-stone-400 text-xs leading-relaxed mb-2">
                            Mặc định Firebase sẽ chặn không cho website khác nhúng phát trực tiếp. Hãy thiết lập tab <strong>Rules (Quy Tắc)</strong> của bạn thành quyền đọc tự do:
                          </p>
                          <div className="relative">
                            <pre className="p-3 bg-black/50 text-[10px] text-amber-200/90 font-mono rounded-lg overflow-x-auto select-text leading-relaxed">
                              {fbRulesExample}
                            </pre>
                            <button
                              onClick={() => copyToClipboard(fbRulesExample, "rules")}
                              className="absolute top-2 right-2 text-[9px] bg-white/5 hover:bg-white/10 px-2 py-1 rounded text-white flex items-center gap-1 cursor-pointer"
                            >
                              {copiedText === "rules" ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />} Sao chép Rule
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex gap-3">
                        <div className="text-amber-400 font-mono text-xs font-bold pt-0.5 shrink-0">03.</div>
                        <div>
                          <h6 className="text-xs font-bold text-white mb-0.5">Dán URL Vào Cấu Hình JSON</h6>
                          <p className="text-stone-400 text-xs leading-relaxed">
                            Chọn tệp tin trên Firebase, nhấn nút sao chép <strong>Download URL</strong> (Sẽ có đầu URL dạng <code className="text-amber-300/80 font-mono text-[10px]">https://firebasestorage.googleapis.com/...</code>) rồi thay thế trực tiếp vào khóa <code className="text-white/80 font-mono">"videoUrl"</code> trong file dữ liệu của bạn.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "drive" && (
                  <div className="space-y-6">
                    <div>
                      <h5 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                        Cách Dùng Link Google Drive Trực Tiếp (Đơn Giản Nhất)
                      </h5>
                      <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                        Hệ thống đã được tích hợp bộ lọc thông minh, tự động chuyển đổi bất kỳ liên kết chia sẻ video Google Drive nào thành trình phát video tương thích cao ngay trong website!
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex gap-3">
                        <div className="text-sky-400 font-mono text-xs font-bold pt-0.5 shrink-0">01.</div>
                        <div>
                          <h6 className="text-xs font-bold text-white mb-0.5">Đặt Quyền Chia Sẻ Video</h6>
                          <p className="text-stone-400 text-xs leading-relaxed">
                            Nhấp chuột phải vào tệp video trên Google Drive của bạn → chọn <strong>Chia sẻ (Share)</strong> → chuyển quyền truy cập chung thành <strong>Bất kỳ ai có đường liên kết (Anyone with the link can view)</strong>.
                          </p>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex gap-3">
                        <div className="text-sky-400 font-mono text-xs font-bold pt-0.5 shrink-0">02.</div>
                        <div>
                          <h6 className="text-xs font-bold text-white mb-0.5">Sao Chép Đường Liên Kết</h6>
                          <p className="text-stone-400 text-xs leading-relaxed">
                            Nhấn nút <strong>Sao chép đường liên kết (Copy link)</strong>. Bạn sẽ nhận được đường dẫn có định dạng:
                            <br />
                            <code className="text-sky-300 font-mono text-[10px] break-all block mt-1 bg-black/30 p-1 rounded-sm select-all">
                              https://drive.google.com/file/d/MÃ_TỆP_CỦA_BẠN/view?usp=sharing
                            </code>
                          </p>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex gap-3">
                        <div className="text-sky-400 font-mono text-xs font-bold pt-0.5 shrink-0">03.</div>
                        <div>
                          <h6 className="text-xs font-bold text-white mb-0.5">Dán Đường Link Vào JSON</h6>
                          <p className="text-stone-400 text-xs leading-relaxed">
                            Mở tệp dữ liệu <code className="text-white/80 font-mono bg-white/5 px-1.5 py-0.5 rounded">src/data/contentData.json</code> và dán trực tiếp đường link vừa sao chép vào thuộc tính <code className="text-sky-300 font-mono">"videoUrl"</code> của dự án mong muốn.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4 flex gap-3 items-start">
                      <HelpCircle className="w-5 h-5 text-sky-400 shrink-0" />
                      <div>
                        <h6 className="text-xs font-bold text-white mb-0.5">Cơ Chế Tự Động Chuyển Đổi</h6>
                        <p className="text-stone-400 text-xs leading-relaxed">
                          Hệ thống sẽ tự động tách mã ID của video và sử dụng chế độ nhúng an toàn (<code className="text-zinc-300 font-mono text-[10px]">/preview</code>), cho phép khách hàng bấm phát và tua video trực tiếp với chất lượng cao nhất của máy chủ Google!
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "naming" && (
                  <div className="space-y-6">
                    <div>
                      <h5 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Chuẩn Hoá Định Dạng & Đặt Tên Tệp
                      </h5>
                      <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                        Để trang web chạy siêu mượt với tốc độ tải trang nhanh và loại bỏ 100% lỗi mã hóa liên kết, việc tối ưu hóa tệp tin là bắt buộc.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                        <span className="text-[10px] font-mono tracking-widest text-[#89AACC] uppercase block">
                          TỆP KHỞI CHẠY VIDEO (.mp4)
                        </span>
                        <h6 className="text-xs font-bold text-emerald-400">Tối ưu hoá chuẩn web</h6>
                        <ul className="text-stone-400 text-[11px] list-disc list-inside space-y-1 pl-1">
                          <li>Sử dụng Codec <strong>H.264 (AAC Audio)</strong> thông dụng.</li>
                          <li>Bitrate nén tối ưu: 2 - 4 Mbps cho video preview.</li>
                          <li>Tốc độ khung hình mượt mà: 24fps - 30fps.</li>
                          <li>Độ phân giải tối ưu: Full HD 1080p hoặc HD 720p.</li>
                        </ul>
                      </div>

                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                        <span className="text-[10px] font-mono tracking-widest text-[#89AACC] uppercase block">
                          QUY TẮC ĐẶT TÊN AN TOÀN
                        </span>
                        <h6 className="text-xs font-bold text-emerald-400">Tránh dấu và khoảng trắng</h6>
                        <ul className="text-stone-400 text-[11px] list-disc list-inside space-y-1 pl-1">
                          <li>Sử dụng chữ cái viết thường và dấu gạch dưới.</li>
                          <li>Không dùng dấu tiếng Việt, không ký tự đặc biệt.</li>
                          <li>Không chừa khoảng cách trắng thừa thãi.</li>
                          <li><strong>Ví dụ xấu:</strong> <span className="text-red-400 line-through">Becomeaeditor  motiongraphic .mp4</span></li>
                          <li><strong>Ví dụ tốt:</strong> <span className="text-emerald-400 font-bold">become_editor_motion_graphics.mp4</span></li>
                        </ul>
                      </div>
                    </div>

                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex gap-3 items-start">
                      <HelpCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>
                        <h6 className="text-xs font-bold text-white mb-0.5">Mẹo Tăng Tốc Độ Cho Trang Web</h6>
                        <p className="text-stone-400 text-xs leading-relaxed">
                          Với các đoạn video nền, hãy luôn xuất bản tệp video không kèm tiếng (Muted Video) hoặc xóa luồng âm thanh để giảm tối đa 50% dung lượng tệp tin video gốc!
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between text-xs text-stone-500 bg-white/[0.01]">
              <span className="font-mono">PHÚC VƯƠNG — CREATIVE DEVELOPMENT ©2026</span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold tracking-wider uppercase text-[10px] transition-all cursor-pointer"
              >
                ĐÃ RÕ, ĐÓNG HƯỚNG DẪN ✕
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
