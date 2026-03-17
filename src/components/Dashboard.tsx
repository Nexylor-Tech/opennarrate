interface DashboardProps {
  totalBlogs: number;
  totalLikes: number;
}

export function Dashboard({ totalBlogs, totalLikes }: DashboardProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 ">Dashboard</h2>
      <div className="flex flex-col gap-3 max-w-sm">
        <div className="flex justify-between items-center py-3 border-b border-[var(--border)]">
          <div className="text-lg text-[var(--muted-foreground)] font-medium  ">Blogs Written</div>
          <div className="text-xl font-bold  ">{totalBlogs}</div>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-[var(--border)]">
          <div className="text-lg text-[var(--muted-foreground)] font-medium  ">Likes Received</div>
          <div className="text-xl font-bold  ">{totalLikes}</div>
        </div>
      </div>
    </div>
  );
}
