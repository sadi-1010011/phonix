"use client";

import BottomNavbar from "@/components/BottomNavbar";
import { Edit } from "lucide-react";

export default function ChatScreen() {
  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-xl">
      {/* Header */}
      <div className="flex items-center px-5 pt-6 pb-2 justify-between bg-background-light dark:bg-background-dark shrink-0">
        <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em] flex-1">
          Messages
        </h2>
        <div className="flex items-center justify-end">
          <button className="flex items-center justify-center rounded-full h-10 w-10 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-primary">
            <Edit size={22} />
          </button>
        </div>
      </div>
      {/* Search Bar */}
      <div className="px-5 py-3 shrink-0 bg-background-light dark:bg-background-dark">
        <label className="flex flex-col w-full">
          <div className="flex w-full items-center rounded-xl h-12 bg-[#e7ebf3] dark:bg-gray-800 overflow-hidden transition-colors">
            <div className="text-[#4c669a] dark:text-gray-400 flex items-center justify-center pl-4 pr-2">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 24 }}
              >
                search
              </span>
            </div>
            <input
              className="flex w-full flex-1 border-none bg-transparent h-full placeholder:text-[#4c669a] dark:placeholder:text-gray-500 px-2 text-base font-normal focus:outline-none focus:ring-0 text-[#0d121b] dark:text-white"
              placeholder="Search by name or product"
              defaultValue=""
            />
          </div>
        </label>
      </div>
      {/* Tabs */}
      <div className="pb-2 shrink-0 bg-background-light dark:bg-background-dark">
        <div className="flex border-b border-[#cfd7e7] dark:border-gray-700 px-5 justify-between gap-4">
          <a className="flex flex-col items-center justify-center border-b-[3px] border-b-primary text-primary pb-3 pt-2 flex-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors rounded-t-lg">
            <p className="text-sm font-bold leading-normal tracking-[0.015em]">
              All
            </p>
          </a>
          <a className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#4c669a] dark:text-gray-400 pb-3 pt-2 flex-1 cursor-pointer hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
            <p className="text-sm font-bold leading-normal tracking-[0.015em]">
              Buying
            </p>
          </a>
          <a className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#4c669a] dark:text-gray-400 pb-3 pt-2 flex-1 cursor-pointer hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
            <p className="text-sm font-bold leading-normal tracking-[0.015em]">
              Selling
            </p>
          </a>
        </div>
      </div>
      {/* Chat List */}
      <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
        {/* Item 1 (Unread) */}
        <div className="flex gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 transition-colors items-center group">
          {/* Avatar with Product Overlap */}
          <div className="relative shrink-0">
            <div
              className="h-14 w-14 rounded-full bg-cover bg-center border border-gray-100 dark:border-gray-700"
              data-alt="Portrait of Alice M."
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCXehmLUN1Zmp7pPEQ14DSZx4PTTE6vromIGhNGAiy7zLWkVHheUXrQNfrK7kEFwQGcegFUzR3bmkk2T1Gybu4nHEEZmdTl3WD3A67fKmU7JsJ29zr1jacSlahEYI2TMzuhAY086bBS8vYY8undznqMk2ynkkoh0iXWQ4t4G4EmwLuUEbja-2swFdKnLNa8yhCCs-r0Am1ri0hHSbzrzX439ARiP7HZmuNRpGUKCGruy_J8sG1P9bAKbHz7dWY1m2WsEu2f7LbjKq0")',
              }}
            ></div>
            <div
              className="absolute -bottom-1 -right-1 h-7 w-7 rounded-lg border-2px border-white dark:border-background-dark bg-cover bg-center shadow-sm"
              data-alt="Blue iPhone 12 back view"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCaJUxOp6NTGfc0ED8xAE2UGs-vxSgUYTO4sjk3i9TpsgambS4oQpdPS8vBYiiXXlK6uPmsvrvvzfL8yav2H1FkZmWTrnKxLjGzr2jIQF0ErustG53_By4dkFs0DRPweI6pezmDVvsvMN3cXF6v7FHppYmY4A7empl55SHJOdHwHDhqH5M5lw9zn5aoWKWG-V-i3HrFoNftjkiWmQ0cgRGsdZtFsO4WBdF7dvBDicjDqlTz7iDC88_PYfIhmwdP3ttCCMTvm92u8XU")',
              }}
            ></div>
          </div>
          <div className="flex flex-1 flex-col justify-center min-w-0">
            <div className="flex justify-between items-baseline mb-0.5">
              <p className="text-[#0d121b] dark:text-white text-base font-semibold leading-tight truncate pr-2">
                Alice M.
              </p>
              <p className="text-primary text-xs font-semibold shrink-0">
                10:05 AM
              </p>
            </div>
            <p className="text-xs text-primary font-medium mb-1 truncate">
              iPhone 12 - 64GB Blue
            </p>
            <div className="flex justify-between items-center gap-2">
              <p className="text-[#0d121b] dark:text-gray-200 text-sm font-medium leading-normal truncate">
                Is this still available?
              </p>
              <div className="h-2.5 w-2.5 rounded-full bg-primary shrink-0 shadow-sm shadow-primary/30" />
            </div>
          </div>
        </div>
        {/* Item 2 */}
        <div className="flex gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 transition-colors items-center group">
          <div className="relative shrink-0">
            <div
              className="h-14 w-14 rounded-full bg-cover bg-center border border-gray-100 dark:border-gray-700"
              data-alt="Logo of TechResell Shop"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBU84lHm01wJBtXmtEwX7YmEqcBo4BUrStIZn7D3JD6u_5nVLcQH2T-i0wAFU4IvV_2Iu761cPfumdY7hbgraPGpjLTzS-nxdGkXeYhQij2yFjm3CXiKiovhk9jj3L812bT4-touh67NpTqK-4LQ6Bfd1Pdaqby0b6ALZeE9zZqrU8QzhqLRIEeF7CFc4sjMVMPHEc_UQmEQDaHkfW5p6mXrET6aacmAOs83LT5V9iOHAz_29SC3jnpifhwHeAyLYdc5ahGzh2SyOE")',
              }}
            ></div>
            <div
              className="absolute -bottom-1 -right-1 h-7 w-7 rounded-lg border-2px border-white dark:border-background-dark bg-cover bg-center shadow-sm"
              data-alt="Black Samsung S21 phone"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA5nI-fWaM_4FN4BBPhy1W7VRQEdb0cmCah0wHgr6p2M7ay7clfReSYH9PqqzlaAIJB3vQV_CU3V08sGfeLZrAslwDV77BHOmI-Mbpcm-KFiw6xcju2p9i8-MzGorMoLjUJUO9TRdNeK3EKE-BGQCfoo5YPHTj3OhxxFUcwCT1b-CKYDzooo-nv3k2R84EwgJ2mRUB4yPojEk8FzLW5hiq089ZMtK1zTf5ovY24e1vDseA1mnFdrKkMI-x5-g7TVWO52wKmUxvNVJw")',
              }}
            ></div>
          </div>
          <div className="flex flex-1 flex-col justify-center min-w-0">
            <div className="flex justify-between items-baseline mb-0.5">
              <p className="text-[#0d121b] dark:text-white text-base font-semibold leading-tight truncate pr-2">
                TechResell Shop
              </p>
              <p className="text-[#4c669a] dark:text-gray-500 text-xs font-normal shrink-0">
                Yesterday
              </p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 truncate">
              Samsung S21 Ultra
            </p>
            <div className="flex justify-between items-center gap-2">
              <p className="text-[#4c669a] dark:text-gray-400 text-sm font-normal leading-normal truncate">
                Offer accepted: $450. When can you ship?
              </p>
            </div>
          </div>
        </div>
        {/* Item 3 */}
        <div className="flex gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 transition-colors items-center group">
          <div className="relative shrink-0">
            <div
              className="h-14 w-14 rounded-full bg-cover bg-center border border-gray-100 dark:border-gray-700"
              data-alt="Portrait of John Doe"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCSExDw8gH5KVqt_6nJJxRpGffEFrhlvMjWLLlwxp362janLilPVV1V2xO9HFuxNX92qGzKXxFfBLu-DjytW2SmPnYTEfJgEJNiTH-JMWcaxa6uIJ1xs7ofUvnZXLp6xYSSi89vNVdNxD_gv0XkXaHjhG0YFF9udvDFizCMOe48peCCLzN1cllhidRpy5TCT7P8t4fZ6Ug3Au4RXu3C1y2-52enJkx0u3TeJGklRwKbIWMRy7_owxCToM4Qh4V_iD445Pr6GVDH6pU")',
              }}
            ></div>
            <div
              className="absolute -bottom-1 -right-1 h-7 w-7 rounded-lg border-2px border-white dark:border-background-dark bg-cover bg-center shadow-sm"
              data-alt="Google Pixel 6 back view"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDzAzaSltkHcgqaB1rQArIwrCqlRvZvHH6PsQgDTtAZXZVibHHhQeYDT4CUVLTOLmyU2vFH1wFNMHGAt5JmY-1Y8CBQQVRDQelebl6HmvpwpxmrGR-PfpS3Fv26s7gLNgRMykTu09QdrzkwxuB3c24UOXUNgHYfkRRw1xj3xjidpvenc8rAC7s_GPBse_o0wjvv0L_WS-QqZi1o6kTUKUtyiavOQii8II_uXE6yJHm061duMZpNGZ8HSnBHTRC0Fxo7WcAC4BCmejI")',
              }}
            ></div>
          </div>
          <div className="flex flex-1 flex-col justify-center min-w-0">
            <div className="flex justify-between items-baseline mb-0.5">
              <p className="text-[#0d121b] dark:text-white text-base font-semibold leading-tight truncate pr-2">
                John Doe
              </p>
              <p className="text-[#4c669a] dark:text-gray-500 text-xs font-normal shrink-0">
                Tuesday
              </p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 truncate">
              Pixel 6 - 128GB Black
            </p>
            <div className="flex justify-between items-center gap-2">
              <p className="text-[#4c669a] dark:text-gray-400 text-sm font-normal leading-normal truncate">
                Can you meet at the downtown Starbucks?
              </p>
            </div>
          </div>
        </div>
        {/* Item 4 */}
        <div className="flex gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 transition-colors items-center group">
          <div className="relative shrink-0">
            <div
              className="h-14 w-14 rounded-full bg-cover bg-center border border-gray-100 dark:border-gray-700"
              data-alt="Portrait of Sarah K."
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBy2OASgei2YyZD19_vrms8KBt04j-kb2m0Dv4c4eMktw5koco_p4SNC-h73Q0NwBSFwRF5hGP8zS5kEA2C7FXmCEc2JLMEYr3cGgtEDG_1_3hDtNSmkM4YBC4OcZtg5AuS6Uboch8D83g23g-ZM1YoQz4HEDIg9N9nYxKlWxbcaYwJNwviRpbaUH0aDUKgiwydZikF-WqK_6yRK3U71gWZJCv8SFl_bJRnfNOABiBKvn-oPaFkp11dtcRKrcxIfoUrt05F6wVSGEg")',
              }}
            ></div>
            <div
              className="absolute -bottom-1 -right-1 h-7 w-7 rounded-lg border-2px border-white dark:border-background-dark bg-cover bg-center shadow-sm"
              data-alt="White iPhone 11 back view"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBBh8LQR2JZ_RcaaeW5e7dol6V33aQ0MT3Fg7U-DKDszBEREYmLylgZN3mAsXY-25f6aaBp5TViWXOTf1TFCC86Z6fO3hViUvQQRCLQ6KHIKCYgDUhaGfOWy0vOUAXv4NxwsKJDOdty40kWM54uRJeyAfvFpwwdmAX51cw4GkjxvUt6Mhu6ooz9MtBzC5U3tBLttlYVPpuaXksd29iwjSsz9MqYCURNqGhciZi5SYD6hZb9vYW2cOUSCEfHWSOK0CgVvNm7sWhA7m4")',
              }}
            ></div>
          </div>
          <div className="flex flex-1 flex-col justify-center min-w-0">
            <div className="flex justify-between items-baseline mb-0.5">
              <p className="text-[#0d121b] dark:text-white text-base font-semibold leading-tight truncate pr-2">
                Sarah K.
              </p>
              <p className="text-[#4c669a] dark:text-gray-500 text-xs font-normal shrink-0">
                Oct 24
              </p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 truncate">
              iPhone 11 Pro Max
            </p>
            <div className="flex justify-between items-center gap-2">
              <p className="text-[#4c669a] dark:text-gray-400 text-sm font-normal leading-normal truncate">
                I'll take it for $300.
              </p>
            </div>
          </div>
        </div>
        {/* Item 5 */}
        <div className="flex gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b border-transparent transition-colors items-center group">
          <div className="relative shrink-0">
            <div
              className="h-14 w-14 rounded-full bg-cover bg-center border border-gray-100 dark:border-gray-700"
              data-alt="Portrait of Mike R."
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAwMF2jHLRGyPVHXYwP5pUETFyebQDdwJruvOPhP2njz8HxQrjW7DiPry-nPeUxNuKOWsrB3FXj_hRHGV4DG4RGoHFoXxT0E6K187g1UJAeWzQOJvWlA4b9c1nxzsXzbwpcPdGxSX5W4DybWatGW17v-ww6q7aAeJ51uWFKH_0yeh5lErgy-Dq8EwsbMxdnreYfx5HctHHsokveA2CsJovecKbkwMAeNzMqB1BsiMUzP-biEvH0_b90y_OVnzxQFO58BxX59bYO7dM")',
              }}
            ></div>
            <div
              className="absolute -bottom-1 -right-1 h-7 w-7 rounded-lg border-2px border-white dark:border-background-dark bg-cover bg-center shadow-sm"
              data-alt="OnePlus 9 phone back view"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAC9cHlgmQ9q1_gbQTweDT0aSGzCAq_2Vm7T9nfet6vixfPM0-ZWY4wHPluZifr49pveTlwI69aYLTWtAxNtnO-kjat9SswawvmUovfe3Su5UOXZLAx1lJGmYQLPotm4yNrdVzrwL6d6Jj4lfZ4PExNJAaTk5w3UTEjZ3yHLxSf6cAMGZS5WL9HXjPZRlQrRjglcxt4eCTnOCFa5p78vUg84cTT-GTsxcsm1jXGrh4KQ8gxs8V0Zk6IG76KbG7SxmBKFE0SKzrnQVw")',
              }}
            ></div>
          </div>
          <div className="flex flex-1 flex-col justify-center min-w-0">
            <div className="flex justify-between items-baseline mb-0.5">
              <p className="text-[#0d121b] dark:text-white text-base font-semibold leading-tight truncate pr-2">
                Mike R.
              </p>
              <p className="text-[#4c669a] dark:text-gray-500 text-xs font-normal shrink-0">
                Oct 20
              </p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 truncate">
              OnePlus 9 - 128GB
            </p>
            <div className="flex justify-between items-center gap-2">
              <p className="text-[#4c669a] dark:text-gray-400 text-sm font-normal leading-normal truncate">
                Deal! See you then.
              </p>
            </div>
          </div>
        </div>
        {/* Empty space for scrolling above nav */}
        <div className="h-20" />
      </div>
    </div>
  );
}
