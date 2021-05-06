import { IsString } from 'class-validator';

class CreatePostDto {
  @IsString()
  public content: string;

  @IsString()
  public title: string;
}

export default CreatePostDto;

/* 
DTO(Data Transfer Object) => 함수간 데이터 교환을 위한 객체
*/
