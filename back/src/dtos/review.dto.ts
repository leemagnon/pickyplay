import { IsString, IsNumber } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  public userIdx: number;

  @IsString()
  public DOCID: string;

  @IsString()
  public content: string;
}

export class UpdateReviewData {
  @IsNumber()
  public reviewIdx: number;

  @IsString()
  public content: string;
}
