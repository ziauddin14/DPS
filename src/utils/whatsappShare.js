import { formatDate } from './dateFormatter';

/**
 * Generate WhatsApp share message for a single task
 */
export function generateSingleTaskMessage(task, settings) {
  const dependency = Array.isArray(task.dependency) 
    ? task.dependency.join(', ') 
    : (task.dependency || 'None');
  
  const message = `📋 Task: ${task.title}

🏢 Department: ${task.department || 'ETD'}
🏛 Dependency: ${dependency}

📌 Status: ${task.status}
⚡ Priority: ${task.priority}

📅 Deadline: ${task.deadline ? formatDate(task.deadline, settings?.dateFormat || 'YYYY-MM-DD') : 'No deadline'}

📝 Description:
${task.description || 'No description provided.'}`;

  return encodeURIComponent(message);
}

/**
 * Generate WhatsApp share message for multiple filtered tasks
 */
export function generateFilteredTasksMessage(tasks, settings) {
  if (!tasks || tasks.length === 0) return null;

  let message = `Digital Personal Secretary

Filtered Task List

`;

  tasks.forEach((task, index) => {
    const dependency = Array.isArray(task.dependency) 
      ? task.dependency.join(', ') 
      : (task.dependency || 'None');
    
    message += `${index + 1}.

Title: ${task.title}
Department: ${task.department || 'ETD'}
Dependency: ${dependency}
Priority: ${task.priority}
Status: ${task.status}
Deadline: ${task.deadline ? formatDate(task.deadline, settings?.dateFormat || 'YYYY-MM-DD') : 'No deadline'}

--------------------------------

`;
  });

  message += `Total Tasks: ${tasks.length}

Generated from Digital Personal Secretary`;

  return encodeURIComponent(message);
}

/**
 * Open WhatsApp with a message
 */
export function openWhatsApp(message) {
  const url = `https://wa.me/?text=${message}`;
  window.open(url, '_blank');
}
