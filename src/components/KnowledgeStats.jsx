import { BookOpen, FileText, Star, Library } from 'lucide-react';
import StatsCard from './StatsCard';

/**
 * KnowledgeStats component.
 * Displays summary cards for the Knowledge Vault, computed from the entries array.
 *
 * @param {Array} [knowledge=[]] - Array of knowledge entry objects.
 */
function KnowledgeStats({ knowledge = [] }) {
  const total     = knowledge.length;
  const notes     = knowledge.filter((k) => k.type === 'Note').length;
  const books     = knowledge.filter((k) => k.type === 'Book').length;
  const favorites = knowledge.filter((k) => k.favorite).length;

  const stats = [
    {
      title:       'Total Entries',
      value:       String(total).padStart(2, '0'),
      icon:        Library,
      description: 'All knowledge vault entries',
      colorClass:  'text-blue-600 bg-blue-50',
    },
    {
      title:       'Notes',
      value:       String(notes).padStart(2, '0'),
      icon:        FileText,
      description: 'Personal notes captured',
      colorClass:  'text-indigo-600 bg-indigo-50',
    },
    {
      title:       'Books',
      value:       String(books).padStart(2, '0'),
      icon:        BookOpen,
      description: 'Books read or in progress',
      colorClass:  'text-amber-600 bg-amber-50',
    },
    {
      title:       'Favorites',
      value:       String(favorites).padStart(2, '0'),
      icon:        Star,
      description: 'Starred for quick access',
      colorClass:  'text-rose-600 bg-rose-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <StatsCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          description={stat.description}
          colorClass={stat.colorClass}
        />
      ))}
    </div>
  );
}

export default KnowledgeStats;
export { KnowledgeStats };
