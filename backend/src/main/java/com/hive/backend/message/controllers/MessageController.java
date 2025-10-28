package com.hive.backend.message.controllers;

import com.hive.backend.message.dtos.MessageDto;
import com.hive.backend.message.models.Message;
import com.hive.backend.message.services.MessageService;
import com.hive.backend.user.models.User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/message")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping
    public List<Message> getMessages(@RequestParam Long senderId, @RequestParam Long receiverId) {
        return messageService.getMessagesForUsers(senderId, receiverId);
    }

    @GetMapping("/user")
    public List<User> getMessages(@RequestParam Long userId) {
        return messageService.getUsersFromConversation(userId);
    }

    @PostMapping
    public Message createMessage(@RequestBody MessageDto messageDto) {
        return messageService.createMessage(messageDto);
    }

    @PutMapping("/{id}")
    public Message updateMessage(@PathVariable String id, @RequestBody MessageDto messageDto) {
        return messageService.updateMessage(id, messageDto);
    }

    @DeleteMapping("/{id}")
    public void deleteMessage(@PathVariable String id) {
        messageService.deleteMessage(id);
    }
}
