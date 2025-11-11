import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function CommunitySolutionsTab({ solutions }) {
  const getStatusBadge = (status: string) => {
    switch ((status || "").toLowerCase()) {
      case "approved":
        return "bg-emerald-500 text-white";
      case "pending":
        return "bg-yellow-500 text-white";
      case "rejected":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="text-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-white/80">Lab ID</TableHead>
            <TableHead className="text-white/80">Status</TableHead>
            <TableHead className="text-white/80">Writeup</TableHead>
            <TableHead className="text-white/80">YouTube URL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {solutions.map((solution) => (
            <TableRow key={solution.id}>
              <TableCell className="text-white">{solution.labId}</TableCell>
              <TableCell>
                <Badge className={getStatusBadge(solution.status)}>{solution.status}</Badge>
              </TableCell>
              <TableCell>
                {solution.writeup ? (
                  <Link
                    href={solution.writeup}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white underline underline-offset-4 hover:text-white/80"
                  >
                    View Writeup
                  </Link>
                ) : (
                  <span className="text-white/60">N/A</span>
                )}
              </TableCell>
              <TableCell>
                {solution.youtubeUrl ? (
                  <Link
                    href={solution.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white underline underline-offset-4 hover:text-white/80"
                  >
                    Watch Video
                  </Link>
                ) : (
                  <span className="text-white/60">N/A</span>
                )}
              </TableCell>
            </TableRow>
          ))}
          {solutions.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="py-6 text-center text-white/70">
                No community solutions found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
