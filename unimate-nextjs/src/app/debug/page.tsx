'use client';

export default function DebugPage() {
  return (
    <div className="bg-black text-white min-h-screen p-4">
      <h1 className="text-4xl mb-8">Layout Debug Test</h1>
      
      {/* Simulate the exact layout structure */}
      <div className="bg-black h-screen relative overflow-hidden">
        
        {/* Title */}
        <div className="absolute left-[26px] top-[54px] text-white text-4xl font-bold">
          Map
        </div>
        
        {/* Search Input Area */}
        <div className="absolute left-[837px] top-7 w-[406px] h-[58px] bg-gray-800 border border-white rounded-xl flex items-center justify-center">
          Search Input
        </div>
        
        {/* Login Button */}
        <div className="absolute left-[1264px] top-7 w-[178px] h-[58px] bg-blue-600 border border-white rounded-xl flex items-center justify-center">
          Log in
        </div>
        
        {/* Sidebar */}
        <div className="absolute left-[26px] top-[105px] w-[312px] h-[816px] bg-gray-800 border-2 border-white rounded-3xl flex items-center justify-center">
          Sidebar Area
        </div>
        
        {/* MAP AREA - This should be clearly visible */}
        <div className="absolute left-[360px] top-[105px] w-[1082px] h-[816px] bg-red-500 border-4 border-yellow-400 flex items-center justify-center z-10">
          <div className="text-center">
            <h2 className="text-white text-6xl font-bold">MAP AREA</h2>
            <p className="text-white text-2xl mt-4">Position: left-[360px] top-[105px]</p>
            <p className="text-white text-2xl">Size: 1082px × 816px</p>
          </div>
        </div>
        
      </div>
    </div>
  );
}
