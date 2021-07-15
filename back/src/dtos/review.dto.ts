import { IsString, IsNumber } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  public userIdx: number;

  @IsString()
  public DOCID: string;

  @IsString()
  public content: string;
}

export class RemoveReviewDto {
  @IsNumber()
  public reviewIdx: number;

  @IsNumber()
  public userIdx: number;
}
