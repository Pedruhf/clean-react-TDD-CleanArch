import React from "react";
import { render, screen } from "@testing-library/react";

import { SurveyItem } from "@/presentation/pages/survey-list/components";
import { mockSurvey } from "@/domain/test";
import { IconNameOptions } from "@/presentation/components";
import { LoadSurveyList } from "@/domain/usecases";

const makeSut = (survey = mockSurvey()): void => {
  render(<SurveyItem survey={survey} />);
};

describe('SurveyItem Component', () => {
  test('Should render with correct values', () => {
    const survey: LoadSurveyList.Model = Object.assign(mockSurvey(), {
      didAnswer: false,
      date: new Date("2022-07-24T00:00:00"),
    });
    makeSut(survey);
    expect(screen.getByTestId("icon")).toHaveProperty("src", IconNameOptions.thumbDown);
    expect(screen.getByTestId("question")).toHaveTextContent(survey.question);
    expect(screen.getByTestId("day")).toHaveTextContent("24");
    expect(screen.getByTestId("month")).toHaveTextContent("jul");
    expect(screen.getByTestId("year")).toHaveTextContent("2022");
  });

  test('Should render with correct values', () => {
    const survey: LoadSurveyList.Model = Object.assign(mockSurvey(), {
      didAnswer: true,
      date: new Date("2019-05-03T00:00:00"),
    });
    makeSut(survey);
    expect(screen.getByTestId("icon")).toHaveProperty("src", IconNameOptions.thumbUp);
    expect(screen.getByTestId("question")).toHaveTextContent(survey.question);
    expect(screen.getByTestId("day")).toHaveTextContent("03");
    expect(screen.getByTestId("month")).toHaveTextContent("mai");
    expect(screen.getByTestId("year")).toHaveTextContent("2019");
  });
});
