import React from 'react';
import { formatInlineStyles } from '../../utils/textFormatting';

interface TableFormatterProps {
  content: string;
}

export function TableFormatter({ content }: TableFormatterProps) {
  const rows = content.split('\n').filter(row => row.trim());
  const headers = rows[0].split('|').filter(cell => cell.trim());
  const alignments = rows[1]?.split('|')
    .filter(cell => cell.trim())
    .map(cell => {
      if (cell.includes(':--:')) return 'center';
      if (cell.includes('--:')) return 'right';
      return 'left';
    });
  const dataRows = rows.slice(2);

  // Process cell content with all formatting rules
  const formatCell = (content: string) => formatInlineStyles(content.trim());

  return (
    <div className="my-4 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead>
          <tr>
            {headers.map((header, i) => (
              <th
                key={i}
                className="px-4 py-2 text-left text-sm font-semibold text-gray-300"
                style={{ textAlign: alignments[i] }}
              >
                {formatCell(header)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {dataRows.map((row, i) => (
            <tr key={i}>
              {row.split('|')
                .filter(cell => cell.trim())
                .map((cell, j) => (
                  <td
                    key={j}
                    className="px-4 py-2 text-sm"
                    style={{ textAlign: alignments[j] }}
                  >
                    {formatCell(cell)}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
