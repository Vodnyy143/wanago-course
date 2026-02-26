import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PostEntity } from './entities/post.entity';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>,
  ) {}

  async createPost(createPostDto: CreatePostDto) {
    const previewUrl = '';

    const post = this.postsRepository.create({
      name: createPostDto.name,
      content: createPostDto.content,
      previewUrl,
    });

    return this.postsRepository.save(post);
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto) {
    const post = await this.postsRepository.update(id, {
      name: updatePostDto.name,
      content: updatePostDto.content,
    });
    if (post.affected === 0) {
      throw new NotFoundException('Post not found');
    }

    return { success: true };
  }

  async deletePost(id: string) {
    const post = await this.postsRepository.delete(id);
    if (post.affected === 0) {
      throw new NotFoundException('Post not found');
    }

    return { success: true };
  }

  async getAllPosts() {
    return this.postsRepository.find();
  }

  async getOnePost(id: string) {
    const post = await this.postsRepository.findOne({
      where: { id },
    });
    if (!post) {
      throw new NotFoundException(`Post not found`);
    }

    return post;
  }
}
