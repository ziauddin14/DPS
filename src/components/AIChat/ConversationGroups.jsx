import ConversationItem from './ConversationItem';

/**
 * Categorize a conversation into a date bucket.
 */
function getBucket(dateVal) {
  if (!dateVal) return 'Older';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return 'Older';

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  const startOf7Days = new Date(startOfToday);
  startOf7Days.setDate(startOf7Days.getDate() - 7);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  if (d >= startOfToday) return 'Today';
  if (d >= startOfYesterday) return 'Yesterday';
  if (d >= startOf7Days) return 'Previous 7 Days';
  if (d >= startOfMonth) return 'This Month';
  return 'Older';
}

const BUCKET_ORDER = ['Today', 'Yesterday', 'Previous 7 Days', 'This Month', 'Older'];

/**
 * ConversationGroups component — groups conversation items into ChatGPT-style time buckets.
 */
function ConversationGroups({
  conversations = [],
  activeId,
  onSelectConversation,
  onRenameSubmit,
  onDeleteRequest,
}) {
  // Group conversations by bucket
  const grouped = BUCKET_ORDER.reduce((acc, bucket) => {
    acc[bucket] = [];
    return acc;
  }, {});

  conversations.forEach((conv) => {
    const bucket = getBucket(conv.updatedAt || conv.createdAt);
    if (grouped[bucket]) {
      grouped[bucket].push(conv);
    } else {
      grouped['Older'].push(conv);
    }
  });

  return (
    <div className="space-y-4">
      {BUCKET_ORDER.map((bucket) => {
        const items = grouped[bucket];
        if (!items || items.length === 0) return null;

        return (
          <div key={bucket} className="space-y-1.5">
            <h5 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2">
              {bucket}
            </h5>
            <div className="space-y-1">
              {items.map((conv) => (
                <ConversationItem
                  key={conv._id}
                  conversation={conv}
                  isActive={conv._id === activeId}
                  onSelect={onSelectConversation}
                  onRenameSubmit={onRenameSubmit}
                  onDeleteRequest={onDeleteRequest}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ConversationGroups;
export { ConversationGroups };
