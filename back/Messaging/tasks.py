from django.utils import timezone
from django_q.tasks import async_task, result
from .models import Message
import logging

logger = logging.getLogger(__name__)

def process_pending_messages(message_id):
    """
    Asynchronously add task pending messages to the queue for sending.
    """

    try:
        message = Message.objects.get(messageId=message_id)

        # update message status to 'queued'
        message.status = 'queued'
        message.save(update_fields=['status'])

        # deliver message
        send_message(message) #***Implement later***

        message.status = 'sent'
        message.save(update_fields=['status'])

        logger.info(f"Message {message.messageId} sent successfully.")
    except Message.DoesNotExist:
        logger.error(f"Message with ID {message_id} does not exist.")
        return False
    except Exception as e:

        logger.error(f"Error processing message {message_id}: {str(e)}")

        message = Message.objects.get(messageId=message_id)
        message.status = 'failed'
        message.retryCount += 1
        message.lastTriedAt = timezone.now()
        message.save(update_fields=['status', 'retryCount', 'lastTriedAt'])
        raise

def send_message(message):
    """
    Placeholder function to simulate message sending.
    In a real implementation, this would interface with an external service.
    """
    # Simulate sending message
    pass

def retry_failed_messages():
    """
    Retry sending messages that have failed.
    """
    from datetime import timedelta

    failed_messages = Message.objects.filter(status='failed', retryCount__lt=3, lastTriedAt__lt=timezone.now() - timedelta(minutes=5))

    for message in failed_messages:
        async_task(process_pending_messages, message.messageId)
        task_name = f"Retry_Message_{message.messageId}"

    return f"Retried {failed_messages.count()} failed messages."
