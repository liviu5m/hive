package com.hive.backend.message.services;

import com.hive.backend.message.dtos.MessageDto;
import com.hive.backend.message.models.Message;
import com.hive.backend.message.repositories.MessageRepository;
import com.hive.backend.user.models.User;
import com.hive.backend.user.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessageService(MessageRepository messageRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    public List<Message> getMessagesForUsers(Long userId1, Long userId2) {
        User user1 = userRepository.findById(userId1).orElseThrow(() -> new RuntimeException("User not found"));
        User user2 = userRepository.findById(userId2).orElseThrow(() -> new RuntimeException("User not found"));
        return messageRepository.findBySenderAndReceiverOrReceiverAndSenderOrderByCreatedAtAsc(user1, user2, user1, user2);
    }

    public Message createMessage(MessageDto messageDto) {
        User sender = userRepository.findById(messageDto.getSenderId()).orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(messageDto.getReceiverId()).orElseThrow(() -> new RuntimeException("Receiver not found"));
        Message message = new Message(messageDto.getId(),messageDto.getContent(), sender, receiver, messageDto.getCreatedAt());
        return messageRepository.save(message);
    }

    public Message updateMessage(String id, MessageDto messageDto) {
        Message message = messageRepository.findById(id).orElseThrow(() -> new RuntimeException("Message not found"));
        message.setContent(messageDto.getContent());
        return messageRepository.save(message);
    }

    @Transactional
    public void deleteMessage(String id) {
        messageRepository.deleteById(id);
    }

    public List<User> getUsersFromConversation(Long userId) {
        return messageRepository.findOtherUsersByMessageWithUser(userId);
    }
}
