import { IsString, IsNumber } from 'class-validator';

export class CreateLikeDto {
  @IsNumber()
  public userIdx: number;

  @IsString()
  public DOCID: string;
}

export class RemoveLikeDto {
  @IsNumber()
  public userIdx: number;

  @IsString()
  public DOCID: string;
}
